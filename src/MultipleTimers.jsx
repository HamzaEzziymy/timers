import React, { useState, useEffect } from 'react';

const Timer = ({ title, startTime, endTime, onDelete, index }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      if (now < start) {
        return 'Not started';
      } else if (now > end) {
        setIsComplete(true);
        return 'Completed';
      }

      const difference = end - now;
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${hours}h ${minutes}m ${seconds}s`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  return (
    <div className="flex items-center justify-between p-6 mb-6 bg-white rounded-lg shadow-lg border-2 border-gray-100">
      <div className="flex-1">
        <h3 className="text-[33px] font-bold text-gray-800 mb-3">
          {title}
        </h3>
        <div className='flex flex-row justify-between'>
          <div className="text-[27px] text-gray-600 mb-2">
            Start: {new Date(startTime).toLocaleString()}
          </div>
          <div className="text-[27px] text-gray-600 mb-3">
            End: {new Date(endTime).toLocaleString()}
          </div>
        </div>
        <div className={`text-[50px] font-bold tracking-wide ${isComplete ? 'text-green-600' : 'text-blue-600'}`}>
          {timeLeft}
        </div>
      </div>
      <button 
        onClick={() => onDelete(index)}
        className="p-3 text-gray -mt-40 hover:text-red-500 transition-colors"
        aria-label="Delete timer"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </button>
    </div>
  );
};

const MultipleTimers = () => {
  const [timers, setTimers] = useState(() => {
    const savedTimers = localStorage.getItem('timers');
    return savedTimers ? JSON.parse(savedTimers) : [];
  });
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

  const addTimer = () => {
    if (!title.trim()) {
      alert('Please enter a title for the timer');
      return;
    }

    if (!startTime || !endTime) {
      alert('Please select both start and end times');
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      alert('End time must be after start time');
      return;
    }

    setTimers([...timers, { title, startTime, endTime }]);
    setTitle('');
    setStartTime('');
    setEndTime('');
  };

  const deleteTimer = (index) => {
    const newTimers = timers.filter((_, i) => i !== index);
    setTimers(newTimers);
  };

  const clearAllTimers = () => {
    if (window.confirm('Are you sure you want to delete all timers?')) {
      setTimers([]);
    }
  };

  return (
    <div className="w-full px-[150px] mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="p-8 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Multiple Timers</h2>
          {timers.length > 0 && (
            <button
              onClick={clearAllTimers}
              className="px-4 py-2 text-red-600 hover:text-red-700 text-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex flex-col gap-6 mb-8">
          <div className="w-full">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Timer Title
            </label>
            <input
              type="text"
              placeholder="Enter timer title..."
              className="w-full p-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                className="w-full p-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                className="w-full p-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={addTimer}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-lg font-semibold shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Add Timer
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {timers.length === 0 ? (
            <div className="text-center text-gray-500 text-xl py-8">
              No timers yet. Add one to get started!
            </div>
          ) : (
            timers.map((timer, index) => (
              <Timer
                key={index}
                title={timer.title}
                startTime={timer.startTime}
                endTime={timer.endTime}
                onDelete={deleteTimer}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleTimers;