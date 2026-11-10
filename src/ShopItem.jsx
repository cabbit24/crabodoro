import confetti from 'canvas-confetti'
import { useState, useEffect } from 'react';
//ui
import gem from "/src/assets/emoji_u1f48e.svg"
import lock from "/src/assets/emoji_u1f512.svg"

function ShopItem(props)
{
    const [unlocked, setUnlocked] = useState(JSON.parse(localStorage.getItem("unlocked" + props.name.replaceAll(' ',''))) || (props.repurchasable != undefined) || (props.unlocked != undefined));

    useEffect(() => {
        localStorage.setItem("unlocked" + props.name.replaceAll(' ',''),unlocked.toString())
    }, [unlocked])
    //locked, if it has a price and you cant afford it
    if(unlocked == false  && (props.gamestate.gems < props.price))
    {
        return(
            <div>
            <label>{props.name}</label>
            <button className="shopItem" disabled><img src={props.skin}></img></button>
            <label className="shop-price"><img src={gem}></img><img src={lock}></img>{props.price}</label>
            </div>
        );
    }
    //locked, if it has a price and you can afford it
    else if(unlocked == false && (props.gamestate.gems >= props.price))
    {
        return(

            <div>
                <div>
                    <label>{props.name}</label>
                    <button className="shopItem" price={props.price} gems={props.gamestate.gems} skin={props.skin} gamestate={props.gamestate} onClick={(e) => {purchase(props, e); setUnlocked(true);}} name={props.name} setName={(name) => props.setName(name)}><img src={props.skin}></img></button>
                    <label className="shop-price"><img src={gem}></img>{props.price}</label>
                </div>
            </div>
        );
    }
    //unlocked but must be repurchased each click used for needs
    else if(unlocked == true && props.repurchasable)
    {
        return(
            <div>
                <div>

                <label>{props.name}</label>
                <button className="shopItem" price={props.price} gems={props.gems} gamestate={props.gamestate} onClick={(e) => {purchase(props, e); setUnlocked(true);}}>
                    <img src={props.item}></img>
                </button>
                <label className="shop-price"><img src={gem}></img>{" " + props.price}</label>
                </div>
            </div>
        );
    }
    //unlocked but can select any time no charge ie skins
    else if(unlocked == true)
    {
        return(
            <div>
                <div>
                    <label>{props.name}</label>
                    <button className="shopItem" price={props.price} onClick={(e) => swap(props)} skin={props.skin} color={props.color}>
                        <img src={props.skin}></img>
                    </button>
                </div>
            </div>
        );
    }
}
//on skin change
function swap(props, e)
{
    //if custom name dont change
    if(['','Crab Rangoons','Larry','Squilliam','Puffy','Tako','Jellofish'].includes(props.gamestate.name.trim()) === true)
    {
        props.setGamestate(g => ({...g, name: props.name}))
    }
    props.setGamestate(g => ({...g, skin: props.skin}));
    props.setGamestate(g => ({...g, color: props.color}));
}
function purchase(props, e)
{
    //if enough gems
    if(props.gems <= 0 || props.gems < props.price)
    {
        return;
    }
    //if valid need amt
    if(props.gamestate[props.need] >= 100)
    {
        props.gamestate[props.need] = 100;
        return;
    }
    if(props.price != null)
    {
        props.setGamestate(g => ({...g, gems: g.gems - props.price}));
    }

    var scalar = 2;
    var gem = confetti.shapeFromText({text:'💎',scalar});

    //changing skin purchase
    if(props.skin != null)
    {
        confetti({
            origin:
            {
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight
            },
            particleCount:10,
            shapes: [gem],
            disableForReducedMotion: true,
            scalar
        });
    }
    //need based purchase
    if(props.need != null && props.need != undefined)
    {
        let need = props.gamestate[props.need];
        props.setGamestate(g => ({...g, [props.need]: need+10}));
    }
    confetti({
        origin:
        {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight
        },
        particleCount:10,
        shapes: [gem],
        disableForReducedMotion: true,
        scalar
    });
}

export default ShopItem
