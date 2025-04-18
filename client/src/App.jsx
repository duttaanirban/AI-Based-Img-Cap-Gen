import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setCaption("");
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please upload an image!");

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/caption", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.caption) {
        setCaption(data.caption);
      } else {
        setCaption("Error generating caption.");
      }
    } catch (err) {
      console.error(err);
      setCaption("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
          🧠 Image Caption Generator
        </h1>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700 text-center">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 p-3 text-sm rounded-lg cursor-pointer focus:outline-none bg-gray-50"
          />
        </div>

        {image && (
          <div className="mb-4 flex justify-center">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="max-h-60 rounded-lg shadow"
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg transition-all font-semibold ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Generating..." : "Generate Caption"}
        </button>

        {caption && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg border text-gray-800">
            <strong>Caption:</strong>
            <p className="mt-1 italic">{caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
