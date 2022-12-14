import React, { useRef } from "react";
import { BsXCircle } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { handleOnClick } from "../../features/API/APISlice";
import {
  handleNextTrack,
  setDisplayTime,
  setDuration,
  setIsPlaying,
  setTrackingProgress,
  setVolume,
} from "../../features/Audio/AudioPlayerSlice";
import Spinner from "../../utils/Spinner";
import AudioControls from "./AudioControls";
import Backdrop from "./Backdrop";
import "./styles.css";

const AudioPlayer = () => {
  const { trackIndex, trackingProgress, isPlaying, volume, displayTime } =
    useSelector((state) => state.audioPlayer);
  const { isLoadingTrack, singleTrack, error } = useSelector(
    (state) => state.APISlice,
  );
  const dispatch = useDispatch();
  const {
    title,
    genres: { primary } = {},
    images: { background } = {},
    hub: { actions } = {},
  } = singleTrack || {};
  // Refs
  const audioRef = useRef("audio");

  const { duration } = audioRef?.current || {};
  const currentPercentage = duration
    ? `${(trackingProgress / duration) * 100}%`
    : "0%";
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #000), color-stop(${currentPercentage}, #777))
  `;
  const displayTimer = (time) => {
    return (
      "0" +
      Math.floor(time / 3600) +
      ":" +
      "0" +
      Math.floor(time / 60) +
      ":" +
      ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  const onScrub = (value) => {
    audioRef.current.currentTime = value;
    dispatch(setTrackingProgress(audioRef.current.currentTime));
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (isPlaying === "play") {
      dispatch(setIsPlaying("play"));
      console.log("on Scrub End");
    }
  };
  if (isPlaying === "play") {
    setTimeout(() => {
      audioRef.current.play();
    }, 0);
  }
  if (isPlaying === "pause") {
    audioRef.current.pause();
  }

  const handleVolume = (q) => {
    dispatch(setVolume(q));
    audioRef.current.volume = q;
  };
  const handleTimeCount = (time) => {
    const timeForDisplay = displayTimer(time);
    dispatch(setDisplayTime(timeForDisplay));
    dispatch(setTrackingProgress(time));
  };
  const handleClose = () => {
    dispatch(setIsPlaying("pause"));
    dispatch(handleOnClick(false));
  };
  // decide what to render
  let content;
  if (isLoadingTrack)
    content = (
      <div className="mx-auto text-center">
        <Spinner />;
      </div>
    );
  if (error) content = <div className="text-danger">{error}</div>;
  if (!isLoadingTrack && !error && title)
    content = (
      <>
        <div className="audio-player">
          <i onClick={handleClose}>
            <BsXCircle size={"30px"} className="close" />
          </i>
          <div className="track-info">
            <img
              className="artwork"
              src={background}
              alt={`track artwork for ${title} by ${primary}`}
            />
            <h2 className="title">{title}</h2>
            <h3 className="artist">{primary}</h3>
            <h4>{displayTime}</h4>
            <audio
              onTimeUpdate={(e) => handleTimeCount(e.target.currentTime)}
              onCanPlay={(e) => dispatch(setDuration(e.target.duration))}
              onEnded={(e) => dispatch(handleNextTrack())}
              ref={audioRef}
              preload="true"
              src={actions?.length > 0 ? actions[1]?.uri : ""}
            />
            <div className="vlme">
              <span className="volum">
                <i className="fas fa-volume-down"></i>
              </span>
              <input
                value={Math.round(volume * 100)}
                min={0}
                max={100}
                type="range"
                name="volBar"
                id="volBar"
                onChange={(e) => handleVolume(e.target.value / 100)}
              />
            </div>
            <AudioControls />
            <input
              type="range"
              value={trackingProgress}
              step="1"
              min="0"
              max={duration ? duration : `${duration}`}
              className="progress"
              onChange={(e) => onScrub(e.target.value)}
              onMouseUp={onScrubEnd}
              onKeyUp={onScrubEnd}
              style={{ background: trackStyling }}
            />
          </div>
          <Backdrop
            trackIndex={trackIndex}
            // activeColor={color}
            isPlaying={isPlaying}
          />
        </div>
      </>
    );

  return content;
};

export default AudioPlayer;
