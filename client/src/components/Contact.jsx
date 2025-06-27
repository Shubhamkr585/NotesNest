import React from 'react'

function Contact() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
        <h2 className='text-2xl'>Contact us</h2>
        <p className='text-lg mt-4'>
            If you have any questions or suggestions, feel free to reach out to us at <a href="mailto:jFk0f@example.com" className='text-blue-600 hover:underline'>jFk0f@example.com</a>.
            <br />
            You can also follow us on our social media channels for updates and announcements.
            Our team is working hard to improve the app and we appreciate your feedback!
        </p>
    </div>
  )
}

export default Contact