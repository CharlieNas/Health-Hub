from eventlet import listen, wsgi
import socketio
import scale
import csv
import threading
import time
import vlc
import subprocess

def speak(message):
  subprocess.run(["espeak", message])

class CountDown:
    def __init__(self, length, name):
        self.status = length
        self.name = name

    def countdown(self):
        if self.status > 0:
            speak(str(self.status))
            self.status -= 1
            # print(f"Countdown now at {self.status} on {self.name}")

    def is_finished(self):
        return self.status == 0

class Sound:
    def __init__(self, filename):
        self.media_player = vlc.MediaPlayer()
        self.media_player.set_media(vlc.Media(filename))
        self.media_player.audio_set_volume(100)

    def play(self):
        self.media_player.play()

    def pause(self):
        self.media_player.pause()

    def wait(self):
        time.sleep(0.25)
        time.sleep(self.media_player.get_length() / 1000)


def main():
    sio = socketio.Server(async_mode="eventlet", cors_allowed_origins="*")

    def alarm():
      notification = Sound("../audio/before_boosted.mp3")
      notification.play()

      weight = False
      bad_countdown = CountDown(10, "bad")
      noise = Sound("../audio/alarm.mp3")
      #countdown/alarm
      should_loop = True
      while should_loop:
          weight = scale.get_weight()
          if weight:
              noise.pause()
              notification.pause()
              should_loop = False
          #else:
              #if bad_countdown.is_finished():
                  #noise.play()
              #else:
                  #bad_countdown.countdown()
                
      # after
      with open("weights.csv", "a") as file:
        writer = csv.writer(file)
        writer.writerow([weight, int(time.time())])
      
      finished_song = Sound("../audio/after_boosted.mp3")
      finished_song.play()
      finished_song.wait()

    def scan_weight():
        weight = None
        for i in reversed(range(20, 0, -1)):
#            speak(str(i))
            weight = scale.get_weight()
            if weight:
                break
        if weight:
            print("Weight Stabilized!")
            return weight
        else:
            print("Weight NOT Stabilized!")
            return "No Weight"

    def add_data():
        weight = scan_weight()
        if type(weight) == str:
            return
        else:
            with open("weights.csv", "a") as file:
                writer = csv.writer(file)
                writer.writerow([weight, int(time.time())])

    def get_data_from_file():
        with open("weights.csv", "r") as file:
            output = []
            for row in file:
                if not row.strip():
                    continue
                weight, stored_time = row.split(",")
                output.append(
                    [float(weight), int(stored_time)]
                )
            return output

    @sio.event
    def connect(sid, _, __):
        print(f"Client Connected: {sid}")

    @sio.event
    def disconnect(sid):
        sio.leave_room(sid, "main_room")
        print(f"Client Disconnected: {sid}")

    @sio.event
    def trigger_alarm(sid):
        alarm_thread = threading.Thread(target=alarm)
        alarm_thread.start()

    @sio.event
    def get_data(sid):
        return get_data_from_file()

    @sio.event
    def set_alarm_time(sid, alarm_time):
        with open("alarmtime.txt", "w") as file:
            file.write(alarm_time)

    def get_alarm_time():
        with open("alarmtime.txt", "r") as file:
            return file.read().strip()

    last_checked = None
    @sio.event
    def check_alarm_time(sid):
        nonlocal last_checked
        print("checking time")
        curr = time.strftime("%d:%H:%M")
        if get_alarm_time() == time.strftime("%H:%M") and last_checked != curr:
            alarm_thread = threading.Thread(target=alarm)
            alarm_thread.start()
            last_checked = curr
          
    @sio.event
    def get_weight_please(sid):
      return scan_weight()

    app = socketio.WSGIApp(sio)
    wsgi.server(listen(("", 4000)), app, log_output=False)


if __name__ == "__main__":
    main()
