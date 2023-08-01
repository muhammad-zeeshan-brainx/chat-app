import './MessageItem.css';
import { Fragment } from 'react';
import { ReactComponent as UserIcon } from './../../assets/user-icon.svg';

function MessageItem({ messageItem, isMessageFromCurrentUser }) {
  return (
    <Fragment>
      <div className='message-item'>
        <div className='user-info'>
          <div className='user-icon'>
            <UserIcon />
          </div>
          <div className='username'>
            {isMessageFromCurrentUser ? 'You' : messageItem?.sentBy?.username}
          </div>
        </div>
        <div className='user-message'>
          <p>{messageItem?.message}</p>
        </div>
      </div>
    </Fragment>
  );
}

export default MessageItem;
