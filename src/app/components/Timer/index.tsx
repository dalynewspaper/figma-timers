import * as React from "react";
import writeToStorage from "../../utils/writeToStorage";
import useStore from "../../useStore";

import styles from "./styles.module.scss";

const minorAudio = new Audio(
  "https://github.com/PavelLaptev/figma-timers/raw/main/src/app/components/Timer/assets/tiktak-3s.mp3"
);
minorAudio.load();
minorAudio.volume = 0.4;
const majorAudio0 = new Audio(
  "https://github.com/PavelLaptev/figma-timers/raw/main/src/app/components/Timer/assets/tiktak-3s.mp3"
);
majorAudio0.load();
majorAudio0.volume = 0.4;
const majorAudio1 = new Audio(
  "https://github.com/PavelLaptev/figma-timers/raw/main/src/app/components/Timer/assets/final1.mp3"
);
majorAudio1.load();
majorAudio1.volume = 0.4;

interface TimerItemProps {
  index: number;
  lastTimer: boolean;
}

const Timer = (props: TimerItemProps) => {
  const {
    config,
    isPlaying,
    nowPlaying,
    setIsPlaying,
    setNowPlaying,
    setConfigTime,
    setConfigMinutes,
    setConfigSeconds,
    setConfigTimerName
  } = useStore();

  ////////////////////////
  ////// USE EFFECT //////
  ////////////////////////

  React.useEffect(() => {
    const joinedTime =
      Number(config.timers[props.index].time.minutes) * 60 +
      Number(config.timers[props.index].time.seconds);
    const joinedTimeMinusSecond = joinedTime - 1;
    const splittedTime = {
      minutes: Math.floor(joinedTimeMinusSecond / 60),
      seconds: joinedTimeMinusSecond % 60
    };
    const totalTime = config.timers.reduce(
      (acc, cur) => acc + (cur.time.minutes + cur.time.seconds),
      0
    );

    // Check if it is the lasat timer
    if (config.timers.length < nowPlaying + 1) setIsPlaying(false);

    // if total time sum is 0, stop timer
    if (totalTime === 0) setIsPlaying(false);

    // Chceck if it is playing and run only one timer
    if (isPlaying && nowPlaying === props.index) {
      // Play sound 5 seconds before end
      if (joinedTime === 0 && !props.lastTimer) minorAudio.play();
      if (joinedTime === 3 && props.lastTimer) majorAudio0.play();
      if (joinedTime === 0 && props.lastTimer) majorAudio1.play();

      // if current time is not 0, next timer
      if (joinedTime === 0) {
        console.log("Timer is over");
        setNowPlaying(props.index + 1);
        return;
      }

      // Run the interval for the timer
      const intervalId = setInterval(() => {
        setConfigTime(splittedTime);
        // If the tied is over switch to the next timer
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [
    config,
    config.timers[props.index].time,
    isPlaying,
    nowPlaying,
    setNowPlaying,
    setConfigTime,
    setConfigMinutes,
    setConfigSeconds
  ]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfigTimerName(e.target.value, props.index);
    writeToStorage(config);
  };

  ////////////////////////
  //// TIME HANDLERS /////
  ////////////////////////

  const reduceTo60 = (str: string) => {
    if (Number(str) > 60) return "60";
    return str;
  };

  const reduceTo59 = (str: string) => {
    if (Number(str) >= 60) return "59";
    return str;
  };

  const setNumbersOnly = (str: string) => {
    const regex = /[^0-9]/g;

    if (str.length > 2) {
      return str.slice(-1).replace(regex, str);
    }
    return str.replace(regex, "");
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNowPlaying(0);
    setConfigMinutes(setNumbersOnly(reduceTo60(e.target.value)), props.index);
    writeToStorage(config);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNowPlaying(0);
    setConfigSeconds(setNumbersOnly(reduceTo59(e.target.value)), props.index);
    writeToStorage(config);
  };

  const handleFocus = e => {
    e.target.select();
  };

  ////////////////////////
  //////// RENDER ////////
  ////////////////////////

  return (
    <section className={`${styles.timer} ${isPlaying ? styles.disabled : ""}`}>
      <section className={styles.header}>
        <input
          className={styles.name}
          onChange={handleNameChange}
          value={config.timers[props.index].name}
        />
      </section>

      <section className={styles.body}>
        <div className={styles.time}>
          <input
            maxLength={3}
            onChange={handleMinutesChange}
            value={config.timers[props.index].time.minutes}
            onFocus={handleFocus}
            onClick={handleFocus}
            className={styles.time_input}
            style={{
              width:
                String(config.timers[props.index].time.minutes).length > 1
                  ? "42px"
                  : "24px"
            }}
          />

          <span className={styles.time_divider}>:</span>

          <input
            maxLength={3}
            onChange={handleSecondsChange}
            value={config.timers[props.index].time.seconds}
            onFocus={handleFocus}
            onClick={handleFocus}
            className={styles.time_input}
            style={{
              width:
                String(config.timers[props.index].time.seconds).length > 1
                  ? "42px"
                  : "24px"
            }}
          />
        </div>
      </section>
    </section>
  );
};

export default Timer;
