import React, {useState, useEffect, useRef, forwardRef, useCallback} from 'react'

import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import confetti from 'canvas-confetti'

import bubbles1 from "./assets/bubbles_part01.wav"
import bubbles2 from "./assets/bubbles_part02.wav"
import bubbles3 from "./assets/bubbles_part03.wav"
import bubbles4 from "./assets/bubbles_part04.wav"
import alarm from "./assets/alarm.wav"

var alarmAudio = new Audio(alarm);


function Pomodoro(props)
{
    const [isRunning, setIsRunning] = useState(false);
    const toSeconds = (m) => (m*60.0);
    const [rewardFlag, setRewardFlag] = useState(true);
    const [time, setTime] = useState(toSeconds(props.minutes))

    useEffect(() =>
    {
        if(props.gamestate.autostart == "off")
        {
            alarmAudio.loop = true;
        }
        else
        {
            alarmAudio.loop = false;
        }
        reset();
    },[props.gamestate.focus,props.gamestate.autostart,
    props.focusMinutes,props.breakMinutes]);
    useEffect(() =>
    {
        if(document != null && document != undefined)
        {
            document.title = formatTime() + " - crabodoro"
        }
        //stop
        if(time <= 0)
        {
            setTime(0);
            reset();
        }
    }, [time,props.minutes]);

    useEffect(() =>
    {
        if(isRunning === true && time > 0)
        {
            //tick
            const interval = setInterval(() =>
            {
                setTime((t) => t -1);
            }, 1000);

            return () =>
            {
                clearInterval(interval);
            }
        }
        //reward when 0
        else if(isRunning === true && time <= 0)
        {
            if(rewardFlag === true)
            {
                props.reward();
            }
            setRewardFlag(false);
            //play one shot
            if(alarmAudio.paused)
            {
                alarmAudio.play();
            }
            if(props.gamestate.autostart == "on")
            {
                reset();
                start();
            }
            else
            {
                setIsRunning(false);
            }
        }
    }, [time,isRunning,rewardFlag,props.minutes]);

    function start()
    {
        if(props.minutes <= 0)
        {
            return;
        }
        setIsRunning(true);
    }
    function stopAlarm()
    {
        alarmAudio.pause();
    }
    function stop()
    {
        setIsRunning(false);
    }
    function reset()
    {
        if(props.gamestate.autostart == "off")
        {
            setIsRunning(false);
        }
        setRewardFlag(true);
        setTime(toSeconds(props.minutes))
    }
    function skip()
    {
        props.swapFocus();
    }
    function formatTime(t)
    {
        return new Date(time * 1000).toISOString().substring(11, 19)
    }
    return(
        <div className="pomodoro">
            <CircularProgressbarWithChildren
                value={(time/toSeconds(props.minutes)*100.0)}
                styles={buildStyles({
                    pathColor: props.gamestate.focus===true?props.gamestate.color:"#00FFA7",
                    trailColor: "#cbc6c0",
                })}
                counterClockwise={true}
            >
                    <div id="display">
                    {
                        formatTime(time)
                    }
                    </div>
                    <div id="crab">
                        <button style={{height:'100px',width:'100px',transform:"rotate(" + props.deg + "deg)"}} className="button"  onMouseDown={onMouseDown}>
                            <img src={props.gamestate.skin}></img>
                        </button>
                    </div>
            </CircularProgressbarWithChildren>
            <hr/>

                <div id="controls">
                    <button onClick={() => {start(); stopAlarm();}} className="start-button">Start</button>
                    <button onClick={() => {stop(); stopAlarm();}} className="stop-button">Stop</button>
                    <button onClick={() => {reset(); stopAlarm();}} className="reset-button">Reset</button>
                    <button onClick={() => {skip(); reset(); stopAlarm();}} className="skip-button">Skip</button>
                </div>

        </div>
    );
}

//petting
function onMouseDown(e)
{
    var bubbles = [bubbles1, bubbles2, bubbles3, bubbles4]
    //random bubbles clip
    let num = Math.floor(Math.random() * bubbles.length)+1;
    //bubble sound
    let clip = bubbles[num]
    new Audio(bubbles[num]).play();
    //ocean bubble particles
    var scalar = 2;
    var bubble = confetti.shapeFromText({text:'🫧',scalar});
    confetti({
        origin:
        {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight
        },
        particleCount: 1,
        flat:true,
        spread:180,
        drift:0.3,
        startVelocity:5,
        gravity:-0.2,
        disableForReducedMotion: true,
        shapes: [bubble],
        scalar
    });

}
export default Pomodoro
