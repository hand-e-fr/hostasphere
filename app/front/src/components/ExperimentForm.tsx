import { useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const ExperimentForm = () => {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setOutput('');

        try {
            const response = await fetch('http://localhost:8080/api/experiments/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept-Charset': 'utf-8',
                },
                body: `code=${encodeURIComponent(code)}`,
            });

            if (response.ok) {
                const data = response.body;
                if (!data) return;

                const reader = data.getReader();
                const decoder = new TextDecoder();
                let done = false;

                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    const chunk = decoder.decode(value);
                    setOutput((prev) => prev + chunk);
                }
            } else {
                setError('An error occurred while executing the experiment.');
            }
        } catch (err) {
            setError('An error occurred while executing the experiment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2>Experiment</h2>
            <p>Enter the code you want to execute:</p>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[15em]">
                    <div className="w-full min-h-full mt-2 col-span-1 md:col-span-2 lg:col-span-4">
                        <label className="label">code</label>
                        <textarea
                            className="input input-bordered input-sm w-full h-full"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            rows={10}
                        />
                    </div>
                    <div className="w-full min-h-full mt-2">
                    <label className="label">requirements.txt</label>
                        <textarea
                            className="input input-bordered input-sm w-full h-full"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            rows={10}
                        />
                    </div>
                </div>
                <button
                    className="btn btn-primary w-[10em] justify-start"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <><span className="loading loading-dots loading-xs"></span>Executing</> : <>
                        <PlayArrowIcon/> Execute</>}
                </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mockup-code">
                {output.split('\n').map((line, index) => (
                    <pre key={index} data-prefix="$"><code>{line}</code></pre>
                ))}
            </div>
        </>
    );
};

export default ExperimentForm;