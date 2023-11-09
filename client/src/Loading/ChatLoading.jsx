import './chatLoading.css';

export default function ChatLoading({userName}) {
    console.log("loading..............................");
    
  return (
    <div id="wave">
        <p className='userName'>
            <span className='user'>{userName} </span> is typing
        </p>
      <div>
      <span className="dot one"></span>
      <span className="dot two"></span>
      <span className="dot three"></span>
      </div>
    </div>
  );
}
