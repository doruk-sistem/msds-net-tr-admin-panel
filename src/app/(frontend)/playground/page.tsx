'use client'

export default function Page() {
  const sendEmail = async () => {
    const res = await fetch('/api/send-email', {
      method: 'POST',
    })
    console.log('responnse: ', res)
  }

  return (
    <div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={sendEmail}>
        send email
      </button>
    </div>
  )
}
