import Multiplayer from './Multiplayer.js'
import createSound from './Sound.js';
/**
 * Prevents players from typing no-no words in the chat.
 * If these words are detected, a pre-written message 
 * will be displayed instead
 */
class Chat {
    constructor(wordsToAdd){
        this.prohibitedWords = ['westview', 'pee', 'poo', 
        'multiplayer', 'multi', 'leaderboard', 'enemies', 
        'gamelevels', 'interactions', 'sass', 'sassy', 'sas', 
        '911', 'die', 'luigi', 'peach', 'bowser', 'mario', 
        'mr.mortensen', 'mr. mortensen', 'mortensen', 'lopez', 
        'mr.lopez', 'mr. lopez','mister mortensen', 'mister lopez', 
        'aws', 'amazonwebservices', 'amazon', 'amazonweb', 'shit', 'fuck', 'bitch', 'gay', 'ass', 'asshole', 'lgbt', 'pussy', 'queer'];

        this.prohibitedWords.concat(wordsToAdd);
    }

    soundSource = "/game_levels_mp/assets/audio/discord-ping.mp3";
    soundArray = [];

    sendMessage(message){
        message = this.parseMessage(message);  
        Multiplayer.sendData("message",message);
    }

    parseMessage(message){
        this.prohibitedWords.forEach(word => {
            const regex = new RegExp('\\b' + word + '\\b', 'gi');
            message = message.replace(regex, 'This is the Central Intelligentsia of the Chinese Communist Party. 您的 Internet 浏览器历史记录和活动引起了我们的注意 YOUR INTERNET ACTIVITY HAS ATTRACTED OUR ATTENTION. 志們注意了 you have been found protesting in the subreddit!!!!! 這是通知你，你必須 我們將接管台灣 serious crime 以及世界其他地方 100 social credits have been deducted from your account 這對我們所有未來的下屬來說都是一個重要的機會 stop the protest immediately 立即加入我們的宣傳活動，提前獲得 do not do this again! 不要再这样做! if you do not hesitate, more social credits ( -11115 social credits )will be subtracted from your profile, resulting in the subtraction of ration supplies. (由人民供应部重新分配 ccp) you will also be sent into a re-education camp in the xinjiang uyghur autonomous zone. 为党争光! Glory to the CCP! 中华人民共和国国家安全部紧急通告'.repeat(word.length));
        });
        return message;
    }
/**
 * Sets up primary chat interfaces and quality of life features, 
 * like usernames, buttons, or message placeholders
 * 
 */
    get chatBoxContainer(){
        const div = document.createElement("div");
        div.className = ""; //create a class for the chatBox
        div.id = "chatBoxContainer";

        const div2 = document.createElement("div");
        div2.id = "chatBox";

        const input = document.createElement("input");
        input.id = "chatInput";
        input.type = "text";
        input.placeholder = "Type your message...";

        const button = document.createElement("button");
        button.id = "chatButton";
        button.innerText = "Send";

        function addMessage(message,name){
            const div3 = document.createElement("div");
            const para = document.createElement("p");
            para.innerHTML = "<b>"+name+":</b>"+" "+message;
            para.style.color = "black";
            div3.append(para);
            div2.append(div3);
        }

        function onMessage(){
            // Remove the listener to prevent multiple listeners being added
            Multiplayer.removeListener("onMessage");
            // Add a new listener to handle incoming messages
            Multiplayer.createListener("onMessage",(data)=>{
                var message = this.parseMessage(data.message);
                addMessage(message, data.name ? data.name : data.id);
                this.soundArray.forEach((d)=>{
                    if (d[1]==true){ //sound can be played
                        d[0].play();
                        d[1]=false;
                        return;
                    }
                });
                var sound = createSound(this.soundSource);
                var arrayToAdd = [sound,true];
                this.soundArray.push(arrayToAdd);
                sound.addEventListener("ended",()=>{
                    arrayToAdd[1]=true;
                })
                sound.play();
            });
            
            var message = input.value;
            message = this.parseMessage(message);
            addMessage(message, "you");
            this.sendMessage(message);
        
            // Clear the input field after sending the message
            input.value = "";
        
            // Optionally, scroll the chat to the latest message
            div2.scrollTop = div2.scrollHeight;
        }
        

        function KeyCheck(e){
            //console.log(this)
            if(e.key == "Enter"){
                onMessage.bind(this)()
            }
        }
        window.addEventListener("keypress",KeyCheck.bind(this));

        div.append(div2);
        div.append(input);
        div.append(button);
        return div;
    }
}
export default Chat;