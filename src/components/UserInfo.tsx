import React from 'react';
import { UserObject } from '../types/index';
import CopyButton from './CopyButton';

interface UserInfoProps {
  user: UserObject;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Account Info</h2>
        <CopyButton text={JSON.stringify(user, null, 2)} label="Copy ID" />
      </div>
      
      {user.email && (
        <div className="mb-1">
          <span className="font-medium text-gray-600">Email:</span> {user.email}
        </div>
      )}
      
      {user.name && (
        <div className="mb-1">
          <span className="font-medium text-gray-600">Name:</span> {user.name}
        </div>
      )}
      
      <div className="mb-1">
        <span className="font-medium text-gray-600">User ID:</span> 
        <span className="text-sm text-gray-500 ml-1">{user.id}</span>
      </div>
    </div>
  );
};

export default UserInfo;