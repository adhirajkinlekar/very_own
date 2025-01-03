import React, { useContext, useEffect, useState } from 'react';
import './learn.styles.css'; // Custom styles if needed
import { useParams } from 'react-router-dom';
import AppContext from '../../context/app_context';
import axiosInstance from '../../util/axiosInterceptor';

const CoursePage = () => {
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const { academyId } = useContext(AppContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await axiosInstance.get(`https://api-academy.veryown.in/api/academy/${academyId}/courses/${id}/learn`);
        const { course } = response.data;
        setLectures(course.sections);
        if (course.sections.length > 0 && course.sections[0].lectures.length > 0) {
          setSelectedLecture(course.sections[0].lectures[0]);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false); // Set loading to false when the request completes
      }
    };

    fetchLectures();
  }, [academyId, id]);

  const selectLecture = (sectionId, itemId) => {
    const section = lectures[sectionId];
    const item = section.lectures[itemId];
 
    setSelectedLecture(item);
  };

  if (loading) {
    // Display a loading spinner or message while data is being fetched
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-50">
  <aside className="w-full lg:w-1/4 p-4 lg:p-6 bg-white shadow-lg rounded-lg border border-gray-200 overflow-y-auto">
    <input
      type="text"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
      placeholder="Search feature is not yet implemented"
    />
    {lectures.map((section, i) => (
      <div key={i} className="mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-semibold mb-2 text-gray-900">{section.title}</h3>
        {section.lectures.map((item, j) => (
          <div
            key={j}
            className={`cursor-pointer p-2 lg:p-3 rounded-lg flex items-center transition-colors duration-300 ${selectedLecture === item ? 'bg-indigo-100 border border-indigo-200' : 'hover:bg-indigo-50'}`}
            onClick={() => selectLecture(i, j)}
          >
            <div className="text-gray-800">
              {j + 1}. {item.title}
            </div>
          </div>
        ))}
      </div>
    ))}
  </aside>
  <main className="w-full lg:w-3/4 p-4 lg:p-6 bg-white shadow-lg rounded-lg mt-4 lg:mt-0 lg:ml-4">
    {selectedLecture ? (
      <>
        {/* <h2 className="text-2xl lg:text-3xl font-extrabold mb-4 text-gray-900">{selectedLecture?.title}</h2> */}
        <VideoPlayer selectedLecture={selectedLecture} />
      </>
    ) : (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Select a lecture to start learning</p>
      </div>
    )}
  </main>
</div>

  );
};

function VideoPlayer({ selectedLecture }) {
  return (
    <div className="video-container mb-4 lg:mb-6 p-2 lg:p-4 bg-gray-100 rounded-lg shadow-sm">
      <video
        controls
        autoPlay
        muted
        className="w-full rounded-lg"
        key={selectedLecture?.url} // Use the URL as the key to force re-render
      >
        <source src={`https://api-common.veryown.in/stream/${selectedLecture?.url?.split('/')?.pop()}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default CoursePage;
