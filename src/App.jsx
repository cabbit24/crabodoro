//Elliot Pribilla
import Pomodoro from './Pomodoro.jsx'
import Popup from './Popup.jsx'
import { useState, useEffect, useRef } from 'react';
import ShopItem from './ShopItem.jsx'
import confetti from 'canvas-confetti'

//svgs
//skins
import crab from "/src/assets/emoji_u1f980.svg"
import lobster from "/src/assets/emoji_u1f99e.svg"
import squid from "/src/assets/emoji_u1f991.svg"
import pufferfish from "/src/assets/emoji_u1f421.svg"
import octopus from "/src/assets/emoji_u1f419.svg"
import jellyfish from "/src/assets/emoji_u1fabc.svg"
//items
import coconut from "/src/assets/emoji_u1f965.svg"
import coral from "/src/assets/emoji_u1fab8.svg"
import seashell from "/src/assets/emoji_u1f41a.svg"
//ui
import gem from "/src/assets/emoji_u1f48e.svg"
import gear from "/src/assets/emoji_u2699.svg"
import bag from "/src/assets/emoji_u1f4b0.svg"
import telephone from "/src/assets/emoji_u260e.svg"
import wing from "/src/assets/emoji_u1fabd.svg"
import warning from "/src/assets/emoji_u26a0.svg"
//social links
import octocat from "/src/assets/GitHub_Invertocat_White.svg"
import berg from "/src/assets/codeberg-logo_icon_white.svg"


function App()
{
  //gamestate local storage
  const [gamestate,setGamestate] = useState(JSON.parse(localStorage.getItem('form')) ||
  {
    name: "Crab Rangoons",
    skin: crab,
    coconuts: 100,
    coral: 100,
    seashells: 100,
    gems: 0,
    focushours: 0,
    focusminutes: 45,
    focusseconds: 0,
    breakhours: 0,
    breakminutes: 15,
    breakseconds: 0,
    autostart: "on",
    focus:true,
    dead: false,
    deg: 0,
    color: "#ff5f00",
  });

  //popups
  const [settingsPopup, setSettingsPopup] = useState(false);
  const [shopPopup, setShopPopup] = useState(false);
  const [deadPopup, setDeadPopup] = useState(false);
  const [helpPopup, setHelpPopup] = useState(false);


  useEffect(() => {
    localStorage.setItem('form',JSON.stringify(gamestate));
  }, [gamestate]);
  function handleSubmit(event)
  {
    event.preventDefault();
  }
  //update gamestate
  function handleChange()
  {
    setGamestate((previousGameState) => ({
      ...previousGameState,
      [event.target.name]: event.target.value,
    }));
  }
  function reward()
  {
    if(gamestate.focus === true)
    {
      //only rewards on focus
      confetti({
        particleCount:120,
        spread:360,
        disableForReducedMotion: true
      });

      //random amt of gems (max-min) roll inclusive
      //may require adjustment for more fun
      let max = 10
      let min = 4
      let rng = Math.floor(Math.random() * (max - min  + 1)) + min;
      //console.log("you rolled" + rng);

      //gem reward
      setGamestate(g => ({...g, gems: g.gems+rng}));
    }
    setGamestate(g => ({...g, coconuts: g.coconuts-10}));
    setGamestate(g => ({...g, coral: g.coral-10}));
    setGamestate(g => ({...g, seashells: g.seashells-10}));
    //handle death
    if(gamestate.coconuts <= 0)
    {
      setGamestate(g => ({...g, coconuts: 0}));
      setGamestate(g => ({...g, deg: 180}));
      setGamestate(g => ({...g, dead: true}));
      setDeadPopup(true)
    }
    if(gamestate.coral <= 0)
    {
      setGamestate(g => ({...g, coral: 0}));
      setGamestate(g => ({...g, deg: 180}));
      setGamestate(g => ({...g, dead: true}));
      setDeadPopup(true)
    }
    if(gamestate.seashells <= 0)
    {
      setGamestate(g => ({...g, seashells: 0}));
      setGamestate(g => ({...g, deg: 180}));
      setGamestate(g => ({...g, dead: true}));
      setDeadPopup(true)
    }

    swapFocus();
  }
  //switch between break/focus mode
  function swapFocus(props)
  {
    setGamestate(g => ({...g, focus: !g.focus}));
    handleChange();
  }

  function revive()
  {
    setGamestate(g => ({...g, dead: false}));
    setGamestate(g => ({...g, gems: 0}));
    setGamestate(g => ({...g, coconuts: 100}));
    setGamestate(g => ({...g, coral: 100}));
    setGamestate(g => ({...g, seashells: 100}));
    setGamestate(g => ({...g, deg: 0}));
    setDeadPopup(false);
  }

  function changeSkin(skin)
  {
    setSkin(skin)
  }
  return (
    <>
      <header style={{backgroundColor: gamestate.color, height:'90px', textAlign: 'center', left:0, top:0, zIndex:10, position:'fixed', width:'100%'}}>
        <h1 id="title">Crabodoro</h1>
      </header>
      <main>
        <ul id="popup-menu">
          <li>
            <button className="button" onClick={() => setSettingsPopup(true)}>
              <img src={gear}></img>
            </button>
          </li>
          <li>
            <button className="button" onClick={() => setShopPopup(true)}>
              <img src={bag}></img>
            </button>
          </li>
          <li>
            <button className="button" onClick={() => setHelpPopup(true)}>
              <img src={telephone}></img>
            </button>
          </li>
        </ul>
        <h3 id="name-label">Name: {gamestate.name}</h3>
        <h4 id="focus-label" style={{color : gamestate.focus?gamestate.color:'#00FFA7'}}>{gamestate.focus?"Focus!":"Break"}</h4>
        <div id="pomodoro">
          <Pomodoro
          minutes={gamestate.focus?gamestate.focusminutes:gamestate.breakminutes} focusMinutes={gamestate.focusminutes}
          breakMinutes={gamestate.breakminutes}
          reward={reward} deg={gamestate.deg} gamestate={gamestate} swapFocus={swapFocus}
          ></Pomodoro>
        </div>
          <div>
            <div>
              <ul id="stat-bars">
                <label>needs:</label>
                <li><label>coconuts ({gamestate.coconuts}%): <img src={coconut}></img></label><progress min="0" max="100" value={gamestate.coconuts}></progress></li>
                <li><label>coral ({gamestate.coral}%):         <img src={coral}></img></label><progress min="0" max="100" value={gamestate.coral}></progress></li>
                <li><label>seashells ({gamestate.seashells}%): <img src={seashell}></img></label><progress min="0" max="100" value={gamestate.seashells}></progress></li>
              </ul>
            </div>
          </div>
      <Popup trigger={settingsPopup} setTrigger={setSettingsPopup}>
      <h1 className="popup-title">settings</h1>
      <p className="popup-title" id="warning-title"><img src={warning}></img> changing these settings may reset your timer!</p>

      <div id="settings-form">
          <form onSubmit={handleSubmit}>
            <h2>pet</h2>
              <li><label for="name">Name</label></li>
              <li><input type="text" id="name" name="name" placeholder={name}
              onBlur=
              {
                (e) =>
                {
                  //if valid input
                  if(e.target.value.trim() != "" && e.target.value.trim() != null)
                  {
                    handleChange();
                  }
                  else
                  {
                    e.target.value = gamestate.name;
                  }
                }
              }
              defaultValue={gamestate.name} ></input></li>
            <h2 className="popup-title">focus</h2>
              <li><label for="focusminutes">minutes</label></li>
              <li><input type="number" id="focusminutes" name="focusminutes" min="1" max="999" placeholder="0"
              onChange=
              {
                (e) =>
                {
                  //if valid input
                  if(e.target.value >= 1 && e.target.value <= 999)
                  {
                    e.target.value = parseInt(e.target.value)
                    handleChange();
                  }
                  else
                  {

                    e.target.value = null;
                  }
                }
              }
              defaultValue={gamestate.focusminutes}></input></li>
            <h2>break</h2>
              <li><label for="breakminutes">minutes</label></li>
              <li><input type="number" id="breakminutes" name="breakminutes" min="1" max="999" placeholder="0"
              onChange=
              {
                (e) =>
                {
                  //if valid input
                  if(e.target.value >= 1 && e.target.value <= 999)
                  {
                    e.target.value = parseInt(e.target.value)
                    handleChange();
                  }
                  else
                  {

                    e.target.value = null;
                  }
                }
              }
              defaultValue={gamestate.breakminutes}></input></li>
              <li><label for="autostart">autostart</label><input type="checkbox" name="autostart" id="autostart" onChange={() => {setGamestate(g => ({...g, autostart: event.target.checked?"on":"off"}));
              }} defaultChecked={gamestate.autostart=="on"?true:false}></input></li>
        </form>
      </div>
      </Popup>
      <Popup trigger={shopPopup} setTrigger={setShopPopup}>
      <h1 className="popup-title">shop</h1>
        <h1 className="shop-subtitle">gems: {gamestate.gems}<img src={gem}></img></h1>
        <h3 className="shop-label">needs</h3>
        <div className="shop-list">
              <ShopItem item={coconut} gamestate={gamestate} setGamestate={setGamestate} repurchasable={true} gems={gamestate.gems} price={1} need={"coconuts"}  name="coconuts (+10%)"></ShopItem>
              <ShopItem item={coral} gamestate={gamestate} setGamestate={setGamestate} repurchasable={true} gems={gamestate.gems} price={1} need={"coral"} name="coral (+10%)"></ShopItem>
              <ShopItem item={seashell} gamestate={gamestate} setGamestate={setGamestate} repurchasable={true} gems={gamestate.gems} price={2} need={"seashells"} name="seashells (+10%)"></ShopItem>
        </div>
        <h3 className="shop-label">skins</h3>
        <div className="shop-list" id="skin-list">
            <ShopItem skin={jellyfish} price={18} name="Jellofish" color="#07cfff" gamestate={gamestate} setGamestate={setGamestate} ></ShopItem>
            <ShopItem skin={octopus} price={10} name="Tako" color="#ff615e" gamestate={gamestate} setGamestate={setGamestate} ></ShopItem>
            <ShopItem skin={pufferfish} price={5} name="Puffy"  color="#f4d6b5" gamestate={gamestate} setGamestate={setGamestate} ></ShopItem>
            <ShopItem skin={squid} price={3} name="Squilliam" color="#ee7fad" gamestate={gamestate} setGamestate={setGamestate} ></ShopItem>
            <ShopItem skin={lobster} price={1} name="Larry" color="#fb1b1d" gamestate={gamestate} setGamestate={setGamestate} ></ShopItem>
            <ShopItem unlocked={true} skin={crab} price={0} color="#ff5f00" name="Crab Rangoons" gamestate={gamestate} setGamestate={setGamestate} ></ShopItem>
        </div>
      </Popup>
      <Popup  trigger={deadPopup} setTrigger={setDeadPopup}>
        <div class="dead-content">
          <p class="popup-title">Oh no! {gamestate.name} has died. :(</p>
          <button  onClick={revive}>🪽Revive {gamestate.name} ({gamestate.gems} 💎)</button>
        </div>
      </Popup>
      <Popup trigger={helpPopup} setTrigger={setHelpPopup}>
        <h1 style={{color:gamestate.color}} class="popup-title">Frequently Asked Questions</h1>
        <ul id="help-content">
          <li>
            <h3 style={{color:gamestate.color}}>Q: How do I change the timer's duration?</h3>
            <h4>A: Click the gear icon on the top left. You can enter the number of break and focus minutes under their respective sections in the settings menu.</h4>
          </li>
          <li>
            <h3 style={{color:gamestate.color}}>Q: What is this?</h3>
            <h4>A: This is a Tamagotchi inspired game based around a Pomodoro timer. When you focus and complete a timer, you earn gems to take care of your pet. See <a href="https://en.wikipedia.org/wiki/Tamagotchi">Tamagotchi (wikipedia)</a> and <a href="https://en.wikipedia.org/wiki/Pomodoro_Technique">Pomodoro (wikipedia)</a> for more details.</h4>
          </li>
          <li>
            <h3 style={{color:gamestate.color}}>Q: How do I take care of my pet?</h3>
            <h4>A: Complete pomodoro sessions to earn gems, you can use these gems to buy items to fulfill your pet's needs</h4>
          </li>
          <li>
            <h3 style={{color:gamestate.color}}>Q: How do I buy things?</h3>
            <h4>A: Click the bag of money on the top left. You can purchase skins, which will change the appearance of your pet, or you can purchase items to fill your pet's needs  (coconuts, coral, and seashells).</h4>
          </li>
          <li>
            <h3 style={{color:gamestate.color}}>Q: Why does the timer turn green sometimes? What's the difference between the color being green and another color?</h3>
            <h4>A: Green means you are in 'break' mode, you will not earn gems when the timer completes in this mode. You should take a break from working, studying, or whatever else you are doing when the timer is green. You can only earn gems when the timer is in 'focus' mode. The text at the top of the timer will display what mode you are in.</h4>
            <h3 style={{color:gamestate.color}}>Q: What happens if one of needs goes beyond zero?</h3>
            <h4>A: Your pet will die. However, you can revive him but it will cost all of your gems.</h4>
            <h3 style={{color:gamestate.color}}>Q: Why isn't my name changing when I change my skin?</h3>
            <h4>A: Your name will only change when you change your skin if you don't have a custom name set. You cannot save custom names to individual skins. You can set a custom name under the settings menu.</h4>
            <h3 style={{color:gamestate.color}}>Q: What is the difference between Start, Pause, Reset, and Skip?</h3>
            <h4>A: Start will start a Pomodoro session. Pause will pause the current Pomodoro session. Reset will reset the current Pomodoro session back to the beginning. Skip will change your focus mode.</h4>
            <h3 style={{color:gamestate.color}}>Q: What does autostart do?</h3>
            <h4 >A: Autostart will automatically start the next Pomodoro session when the current one completes, if it is disabled you will have to start the next session manually.</h4>
            <p  style={{color:'rgba(255,255,255,0.5)', marginTop:'100px'}}><hr/>alarm clock buzzer alarm beep by Garuda1982 -- <a href="https://freesound.org/s/530172/">https://freesound.org/s/530172/</a> -- License: Creative Commons 0<br/><br/>
            bubbles (2).wav by Glaneur de sons -- <a href="https://freesound.org/s/104950/">https://freesound.org/s/104950/</a> -- License: Attribution 4.0<br/><br/>
            <a href="https://github.com/googlefonts/noto-emoji">Noto Emoji</a> Copyright 2013 Google, Inc.<br/><br/>
            Licensed under the Apache License, Version 2.0 (the "License");
            you may not use this file except in compliance with the License.
            You may obtain a copy of the License at<br/><br/>

            <a href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a><br/><br/>

            Unless required by applicable law or agreed to in writing, software
            distributed under the License is distributed on an "AS IS" BASIS,
            WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
            See the License for the specific language governing permissions and
            limitations under the License.</p>
          </li>
        </ul>
      </Popup>
      </main>
      <footer id="footer">
        <hr/>
            <p>
            author: Elliot Pribilla<br/>
            <a href="https://github.com/cabbit24" className="social-link"><img src={octocat}></img></a> <a href="https://codeberg.org/cabbit24" className="social-link"><img src={berg}></img></a><br/>
            </p>
            <p style={{color:'rgba(255,255,255,0.25)'}}>
            <small>created by a human, not by AI</small>
            </p>
      </footer>

    </>
  );
}

export default App
