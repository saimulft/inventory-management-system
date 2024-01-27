
import './chatLoading.css';

export default function ChatLoading() {

  return (
    <div id="wave">
      <p className='text-xs'>Typing</p>
      <div className='relative -left-[2px] top-[2px]'>
        <span className="dot one"></span>
        <span className="dot two"></span>
        <span className="dot three"></span>
      </div>
    </div>
  );
}
