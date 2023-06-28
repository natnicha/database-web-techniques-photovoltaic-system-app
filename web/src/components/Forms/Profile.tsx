import React, { useState } from 'react';

export default function ManageProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nBio: ${bio}`);
  }

  return (
    <div className="py-6 flex flex-col justify-center relative overflow-hidden">
      <div className="relative px-6 pt-10 pb-8 bg-white shadow-xl ring-1 ring-gray-900/5 sm:max-w-lg sm:rounded-lg sm:px-10">
        <div className="max-w-md mx-auto">
          <div className="divide-y divide-gray-300/50">
            <div className="py-8 text-base leading-7 space-y-6 text-blue-600">
              <h1 className="text-2xl font-bold">Personal Profile</h1>
              <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="mb-6">
                  <label htmlFor="name" className="block mb-2 text-sm font-bold text-gray-700">Name</label>
                  <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500" />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500" />
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block mb-2 text-sm font-bold text-gray-700">Phone</label>
                  <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500" />
                </div>

                <div className="mb-6">
                  <label htmlFor="bio" className="block mb-2 text-sm font-bold text-gray-700">Bio</label>
                  <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full h-32 p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"></textarea>
                </div>

                <div className="mb-6">
                  <button type="submit" className="w-full p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}