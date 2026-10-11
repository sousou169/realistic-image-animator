import { useMemo, useState } from 'react';

const defaultPrompt =
  'Ultra realistic cinematic image animation, subtle camera drift, natural parallax, realistic lighting, atmospheric motion, photorealistic textures, 30-second video, smooth temporal continuity, high detail, filmic color grade.';

const motionPresets = {
  cinematic: 'Cinematic',
  dramatic: 'Dramatic',
  subtle: 'Subtle',
  product: 'Product',
};

function App() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [duration, setDuration] = useState(30);
  const [motion, setMotion] = useState('cinematic');
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const imagePreview = useMemo(() => {
    if (!imageFile) return '';
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!imageFile) {
      setError('Please choose an image before generating.');
      return;
    }

    setError('');
    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('duration', String(duration));
    formData.append('motion', motion);
    formData.append('image', imageFile);

    try {
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Generation failed.');
      }

      const data = await response.json();
      setResult(data);
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Seedance 2.5 ready</p>
          <h1>Realistic Image Animator</h1>
        </div>
        <div className="topbar-pill">30s motion</div>
      </header>

      <main className="workspace">
        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="kicker">Generate</p>
              <h2>Create cinematic motion</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="generator-form">
            <label className="field">
              <span>Image</span>
              <div className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                />
              </div>
            </label>

            <label className="field">
              <span>Prompt</span>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={7}
              />
            </label>

            <div className="control-grid">
              <label className="field compact">
                <span>Duration</span>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value) || 30)}
                />
              </label>

              <label className="field compact">
                <span>Motion</span>
                <select value={motion} onChange={(event) => setMotion(event.target.value)}>
                  {Object.entries(motionPresets).map(([key, label]) => (
                    <option value={key} key={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button type="submit" className="primary-button" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate 30s video'}
            </button>
          </form>

          {error && <div className="notice error">{error}</div>}
        </section>

        <section className="panel preview-panel">
          <div className="preview-header">
            <div>
              <p className="kicker">Preview</p>
              <h2>Visual output</h2>
            </div>
          </div>

          {imagePreview ? (
            <div className="preview-card">
              <img src={imagePreview} alt="Selected upload preview" className="image-preview" />
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">+</div>
              <p>Upload an image to start</p>
            </div>
          )}

          {result && (
            <div className="result-card">
              <div className="result-toolbar">
                <span className="status-badge">{result.source}</span>
                <span>{result.duration}s</span>
              </div>

              <video controls src={result.video_url} className="generated-video" />

              <div className="result-actions">
                <a href={result.video_url} target="_blank" rel="noreferrer" className="download-link">
                  Download video
                </a>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
