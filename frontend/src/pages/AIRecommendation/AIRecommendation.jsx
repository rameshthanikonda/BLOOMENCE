

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home } from 'lucide-react';
import './AIRecommendation.css';

// --- CONSTANTS ---
const API_BASE = import.meta.env.VITE_API_URL || 'https://bloomence-mss1.onrender.com';
const BOT_API_URL = `${API_BASE}/api/gemini/chat`;
const BOT_STREAM_URL = `${API_BASE}/api/gemini/chat-stream`;
const ACCENT_COLOR = '#00d9a5';

// --- HELPER FUNCTION: Generates YouTube Thumbnail URL ---
const getYouTubeThumbnail = (videoId) => {
    if (!videoId) return 'https://via.placeholder.com/400x225/2a3d54/FFFFFF?text=No+Thumbnail';
    // 'hqdefault.jpg' provides a high-quality (480x360) image
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const ArrayWithContent = (arr) => arr && Array.isArray(arr) && arr.length > 0;

// --- DUMMY DATA (RESTORED) ---
const ARTICLES_DATA = [
    // Slot 1: Featured (Large, Left Column Top)
    {
        id: 'article1',
        type: 'Article',
        category: 'Substance Abuse',
        title: 'The Impact of Substance Abuse on Mental Health',
        description: 'Explore how substance abuse profoundly affects mental well-being...',
        image: 'https://healthkunj.com/wp-content/uploads/Drug-Addiction-Substance-Abuse.jpg',
        link: 'https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/drugs-and-mental-health',
        size: 'featured',
    },
    // Slot 2: Standard (Small, Left Column Bottom)
    { id: 'article2', type: 'Article', category: 'Stress Management', title: 'Everything You Need to Know About Stress and Anxiety', description: 'A comprehensive guide...', image: 'https://cdn.sanity.io/images/eztzxh9q/production/b958749cfcc7906becea3910ebe3db54ba85704e-2119x1414.jpg?w=3840&q=75&fit=clip&auto=format', link: 'https://www.healthline.com/health/stress-and-anxiety', size: 'standard' },
    // Slot 3: Mini 1 (Right Column Top)
    { id: 'article3', type: 'Article', category: 'Yoga Therapy', title: 'Yoga Therapy: How It Works and Why It Is Important', description: 'Discover the therapeutic benefits of yoga for mental health...', image: 'https://images.news18.com/ibnlive/uploads/2022/04/yoga-164923092416x9.png', link: 'https://positivepsychology.com/yoga-therapy/', size: 'mini' },
    // Slot 4: Mini 2 (Right Column Middle)
    { id: 'article4', type: 'Article', category: 'Self-Improvement', title: 'Best Self-Help Books That Actually Change Lives: How to Improve Yourself', description: 'A curated list...', image: 'https://cultivatewhatmatters.com/cdn/shop/articles/atomic-habits.jpg?v=1624827508', link: 'https://notesbythalia.com/best-self-improvement-books/', size: 'mini' },
    // Slot 5: Mini 3 (Right Column Bottom)
    { id: 'article5', type: 'Article', category: 'Mental Health Symptoms', title: 'Recognising Mental Health Symptoms: Hidden Signs of Mental Health Problems', description: 'Learn to identify subtle and often overlooked signs of mental health issues...', image: 'https://mpowerminds.com/assetOLD/images/physical-symptoms.jpg', link: 'https://www.mayoclinic.org/diseases-conditions/mental-illness/symptoms-causes/syc-20374968', size: 'mini' },

    // Remaining article data 
    { id: 'article6', type: 'Article', category: 'Self-Criticism', title: 'How to Stop Being Self-Critical', description: 'Practical strategies...', image: 'https://via.placeholder.com/300x150/9C27B0/FFFFFF?text=Self-Criticism', link: '#', size: 'mini' },
];

const VIDEO_CATEGORIES = [
    'Stress Management', 'Anxiety Disorders', 'Depression', 'Self-Esteem',
    'Emotional Regulation', 'Mindfulness', 'Relationships', 'Substance Abuse'
];

const VIDEOS_DATA = [
    // ... videos data
    { id: 'v1', category: 'Anxiety Disorders', title: 'Understanding Generalized Anxiety Disorder (GAD)', videoId: 'QAd7IirpoU0', duration: '10 mins', expert: 'Dr. Harry Barry', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=QAd7IirpoU0', },
    { id: 'v2', category: 'Anxiety Disorders', title: 'Coping Strategies for Panic Attacks', videoId: '8Un_Ykh9y9Q', duration: '13 mins', expert: 'Dr. Harry Barry', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=8Un_Ykh9y9Q', },
    { id: 'v3', category: 'Anxiety Disorders', title: 'Effective Therapy Options for Anxiety', videoId: '4Py0xKujsuU', duration: '13 mins', expert: 'Dr. Tracy Marks', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=4Py0xKujsuU', },

    // ... (rest of video data) ...
    { id: 'v4', category: 'Depression', title: 'Signs and Symptoms of Clinical Depression', videoId: 'N45Fsbd4KLc', duration: '21 mins', expert: 'Dr. Scott Eilers', expertTitle: 'Psychiatrist', link: 'https://www.youtube.com/watch?v=N45Fsbd4KLc', },
    { id: 'v5', category: 'Depression', title: 'Managing Low Mood and Energy', videoId: 'sXs0Qq0EEdY', duration: '18 mins', expert: 'Dr. Scott Eilers', expertTitle: 'Psychiatrist', link: 'https://www.youtube.com/watch?v=sXs0Qq0EEdY', },
    { id: 'v6', category: 'Depression', title: 'Finding Motivation During Depression', videoId: 'd96akWDnx0w', duration: '9 mins', expert: 'Dr. Jessica Houston', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=d96akWDnx0w', },

    // --- Stress Management (3 Videos) ---
    { id: 'v7', category: 'Stress Management', title: 'Mindfulness for Daily Stress Reduction', videoId: 'fcRANlaqf9c', duration: '6 mins', expert: 'Dr. Tracy Marks', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=fcRANlaqf9c', },
    { id: 'v8', category: 'Stress Management', title: 'Quick De-stressing Techniques', videoId: 'grfXR6FAsI8', duration: '3 mins', expert: 'Dr. Emma McAdam', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=grfXR6FAsI8', },
    { id: 'v9', category: 'Stress Management', title: 'Time Management to Reduce Overwhelm', videoId: 'b0EdU-mTkZA', duration: '11 mins', expert: 'Dr.Luke Reinhart', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=b0EdU-mTkZA', },

    // --- Self-Esteem (2 Videos) ---
    { id: 'v10', category: 'Self-Esteem', title: 'Building Positive Self-Confidence', videoId: 'oOWhq1BTRuU', duration: '8 mins', expert: 'Dr. Tracy Marks', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=oOWhq1BTRuU', },
    { id: 'v11', category: 'Self-Esteem', title: 'Overcoming Negative Self-Talk', videoId: 'KfAAIEncDPo', duration: '21 mins', expert: 'Dr. Emma McAdam', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=KfAAIEncDPo', },

    // --- Emotional Regulation (2 Videos) ---
    { id: 'v12', category: 'Emotional Regulation', title: 'Identifying Emotional Triggers', videoId: 'l3i8SfOk5FU', duration: '7 mins', expert: 'Dr. Nicola', expertTitle: 'Psychologist', link: 'https://www.youtube.com/watch?v=l3i8SfOk5FU', },
    { id: 'v13', category: 'Emotional Regulation', title: 'Techniques for Managing Strong Emotions', videoId: 'NtW5oWXAaTc', duration: '8 mins', expert: 'Dr. Sid Warrier', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=NtW5oWXAaTc', },

    // --- Mindfulness (2 Videos) ---
    { id: 'v14', category: 'Mindfulness', title: 'Introduction to Mindful Breathing', videoId: '7-jJqXU25wo', duration: '7 mins', expert: 'Dr. Sid Warrier', expertTitle: 'Therapist', link: 'https://www.youtube.com/watch?v=7-jJqXU25wo', },
    { id: 'v15', category: 'Mindfulness', title: 'Simple 5-Minute Meditation', videoId: 'IdUrixeWbis', duration: '5 mins', expert: 'Dr. Alex Howard', expertTitle: 'Instructor', link: 'https://www.youtube.com/watch?v=IdUrixeWbis', },

    // --- Relationships (2 Videos) ---
    { id: 'v16', category: 'Relationships', title: 'Improving Communication Skills', videoId: 'LI57EB_T38c', duration: '18 mins', expert: 'Vinh Giang', expertTitle: 'Counselor', link: 'https://www.youtube.com/watch?v=LI57EB_T38c', },
    { id: 'v17', category: 'Relationships', title: 'Setting Healthy Boundaries', videoId: '83JE0jHAvBY', duration: '29 mins', expert: 'Jay Shetty', expertTitle: 'Counselor', link: 'https://www.youtube.com/watch?v=83JE0jHAvBY', },

    // --- Substance Abuse (2 Videos) ---
    { id: 'v18', category: 'Substance Abuse', title: 'Understanding Addiction and Recovery', videoId: 'PY9DcIMGxMs', duration: '15 mins', expert: 'Johann Hari', expertTitle: 'Specialist', link: 'https://www.youtube.com/watch?v=PY9DcIMGxMs', },
    { id: 'v19', category: 'Substance Abuse', title: 'Resources for Families Dealing with Addiction', videoId: '1qI-Qn7xass', duration: '15 mins', expert: 'Sam Fowler', expertTitle: 'Counselor', link: 'https://www.youtube.com/watch?v=1qI-Qn7xass', },

];

const getArticleLayoutSlots = (data) => {
    return {
        featured: data.find(a => a.size === 'featured'),
        standard: data.find(a => a.size === 'standard'),
        miniStack: data.filter(a => a.size === 'mini').slice(0, 3),
    };
};

const { featured, standard, miniStack } = getArticleLayoutSlots(ARTICLES_DATA);

// Reusable ArticleCard component (unchanged)
const ArticleCard = ({ article, className }) => (
  <motion.a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`article-card ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
    >
        <div className="article-image-wrapper">
            <img src={article.image} alt={article.title} className="article-image" />
        </div>
        <div className="article-content">
            <div className="article-meta">
                <span className="article-type">{article.type}</span>
                <span className="article-category">{article.category}</span>
            </div>
            <h3 className="article-title">{article.title}</h3>
            {article.size === 'featured' && <p className="article-description">{article.description}</p>}
        </div>
    </motion.a>
);

// Reusable VideoCard component (unchanged)
const VideoCard = ({ video }) => (
    <motion.a
        href={video.link}
        target="_blank"
        rel="noopener noreferrer"
        className="video-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
    >
        <div className="video-thumbnail-wrapper">
            <img src={getYouTubeThumbnail(video.videoId)} alt={video.title} className="video-thumbnail" />
            <div className="play-icon">▶</div>
            <div className="video-duration">{video.duration}</div>
        </div>
        <div className="video-info">
            <h4 className="video-title">{video.title}</h4>
            <p className="video-expert">{video.expert}, {video.expertTitle}</p>
            <div className="video-category-tag">{video.category}</div>
        </div>
    </motion.a>
);


// 🟢 FINAL CHAT INPUT BOX COMPONENT (EMBEDDED)
function ChatInputBox({ onSubmit, isLoading, currentUser, lastResponse }) {
    const [localInput, setLocalInput] = useState('');

    // Determine placeholder text
    const placeholderText = !currentUser
        ? "Please log in to ask BloomBot..."
        : (isLoading ? "Analyzing and generating response..." : "Ask BloomBot AI...");

    // Determine if we should show the full response box
    const showResponseBox = lastResponse || isLoading;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (localInput.trim() && !isLoading && currentUser) {
            onSubmit(localInput.trim());
            setLocalInput('');
        }
    };

    // Lightweight formatter: remove numbering and break sentences to new lines
    const formatResponse = (text) => {
        if (!text) return '';
        let t = text;
        // 1) Remove numbered prefixes at line starts like `1. `, `2. `
        t = t.replace(/(^|\n)\s*\d+\.\s+/g, (m, p1) => p1 || '');
        // 2) Remove trailing numbering artifacts like `.2.` or `.2` right after a sentence
        t = t.replace(/\.\s*\d+\.(?=\s|$)/g, '.');
        t = t.replace(/\.\s*\d+(?=\s|$)/g, '.');
        // 3) Remove lines that end with a bare number
        t = t.replace(/(^|\n)([^\n]*?)\s*\d+\s*$/gm, (m, p1, p2) => `${p1}${p2}`);
        // 4) Insert newline after sentence-ending punctuation even if no space follows (markdown/bold)
        t = t.replace(/([.!?])(?!\n)/g, '$1\n');
        // 4b) Also break after semicolons and long dashes (em/en)
        t = t.replace(/;\s+/g, ';\n');
        t = t.replace(/[—–]\s+/g, '\n');
        // 5) Normalize excessive newlines
        t = t.replace(/\n{3,}/g, '\n\n').trim();
        return t;
    };

    const pickEmoji = (line) => {
        const l = (line || '').toLowerCase();
        if (/congrat|bravo|great|good job|well done|proud/.test(l)) return '🎉';
        if (/tip|suggest|try|consider|you can|recommend/.test(l)) return '💡';
        if (/important|note|remember|keep in mind/.test(l)) return '📝';
        if (/(doctor|therapist|counsel|professional|specialist|psychiatrist)/.test(l)) return '👩‍⚕️';
        if (/(emergency|crisis|urgent|immediately|call)/.test(l)) return '⚠️';
        if (/(sleep|rest|insomnia|night|bedtime)/.test(l)) return '😴';
        if (/(nutrition|diet|food|eat|meal|hydrate|water)/.test(l)) return '🥗';
        if (/(exercise|walk|movement|workout|yoga|stretch)/.test(l)) return '🏃‍♂️';
        if (/(mind|brain|focus|cognitive)/.test(l)) return '🧠';
        if (/(stress|anxiety|calm|breathe|breathing|relax)/.test(l)) return '🧘';
        if (/(support|help|reach out|talk to)/.test(l)) return '🤝';
        if (/(resources|learn more|link)/.test(l)) return '🔗';
        if (/(schedule|plan|routine|habit)/.test(l)) return '📅';
        if (/(celebrate|wins|progress)/.test(l)) return '🌟';
        return '';
    };

    const scrollRef = useRef(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [lastResponse, isLoading]);

    return (
        <div className="ai-input-section-wrapper">

            {/* 1. Response Box (Only shows if a query has been made or is loading) */}
            {showResponseBox && (
                <div className="ai-response-box">
                    <div className="response-content" ref={scrollRef}>
                        {lastResponse ? (
                            (() => {
                                const lines = formatResponse(lastResponse).split('\n').filter(l => l.trim().length);
                                const rows = [];
                                let currentRole = 'bot';
                                let buffer = [];
                                const flush = (role) => {
                                    if (!buffer.length) return;
                                    if (role === 'bot') {
                                        // Each sentence -> its own mini-bubble on the left
                                        buffer.forEach((ln) => {
                                            const emoji = pickEmoji(ln);
                                            const html = (emoji ? emoji + ' ' : '') + ln.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                                            rows.push(
                                                <div key={rows.length} className={`chat-row ${role}`}>
                                                    <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: html }} />
                                                </div>
                                            );
                                        });
                                    } else {
                                        const text = buffer.join(' ').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                                        rows.push(
                                            <div key={rows.length} className={`chat-row ${role}`}>
                                                <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: text }} />
                                            </div>
                                        );
                                    }
                                    buffer = [];
                                };
                                for (const ln of lines) {
                                    if (ln.startsWith('You:')) {
                                        flush(currentRole);
                                        currentRole = 'you';
                                        buffer.push(ln.replace(/^You:\s*/, ''));
                                    } else if (ln.startsWith('Bot:')) {
                                        flush(currentRole);
                                        currentRole = 'bot';
                                        buffer.push(ln.replace(/^Bot:\s*/, ''));
                                    } else {
                                        buffer.push(ln);
                                    }
                                }
                                flush(currentRole);
                                return rows;
                            })()
                        ) : (
                            <p className="loading-text">Analyzing and generating response...</p>
                        )}
                    </div>
                </div>
            )}

            {/* 2. Input Bar (Fixed rectangular shape) */}
            <form onSubmit={handleSubmit} className="ai-chat-form">
                <input
                    type="text"
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)}
                    placeholder={placeholderText}
                    disabled={isLoading || !currentUser}
                    className="ai-chat-input"
                />
                <button type="submit" disabled={isLoading || !currentUser} className="ai-send-btn">
                    {isLoading ? '...' : '→'}
                </button>
            </form>
        </div>
    );
}


// 🟢 SELF-HELP TOOLS (inline components)
function useLocalStorage(key, initial) {
    const [state, setState] = useState(() => {
        try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initial; } catch { return initial; }
    });
    useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
    return [state, setState];
}

function useUserStorage(key, initial) {
    const { currentUser } = useAuth();
    const scopedKey = `${currentUser?.uid || 'anon'}:${key}`;
    return useLocalStorage(scopedKey, initial);
}

function Card({ title, children, className = '' }) {
    return (
        <div className={`tool-card ${className}`}>
            <h3 className="tool-title">{title}</h3>
            <div className="tool-body">{children}</div>
        </div>
    );
}

function MeditationCard() {
    const presets = [
        { id: 'm1', title: '5-min Calm Breathing', type: 'youtube', src: 'https://www.youtube.com/embed/7-jJqXU25wo' },
        { id: 'm2', title: 'Body Scan Meditation', type: 'youtube', src: 'https://www.youtube.com/embed/86m4RC_ADEY' },
        { id: 'm3', title: 'Ocean Waves (Audio)', type: 'audio', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    ];
    const [current, setCurrent] = useUserStorage('meditations.current', presets[0]);
    return (
        <Card title="Guided Meditations">
            <div className="med-list">
                {presets.map(p => (
                    <button key={p.id} className={`med-item ${current?.id===p.id?'active':''}`} onClick={()=>setCurrent(p)}>{p.title}</button>
                ))}
            </div>
            <div className="med-player">
                {current?.type==='youtube' ? (
                    <iframe title={current.title} src={current.src} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                ) : (
                    <audio controls src={current?.src} />
                )}
            </div>
        </Card>
    );
}

// --- Additional Self-Help Tools ---
function AffirmationsCard() {
    const BASE = [
        "You are growing a little every day 💚",
        "Your efforts matter more than perfection.",
        "You deserve kindness—from yourself, too.",
        "One small step is still forward.",
        "You can do hard things.",
    ];
    const [current, setCurrent] = useUserStorage('affirm.current', BASE[0]);
    const [favorites, setFav] = useUserStorage('affirm.favs', []);
    const next = () => {
        const all = [...BASE, ...favorites.filter(f=>!BASE.includes(f))];
        const pick = all[Math.floor(Math.random()*all.length)] || BASE[0];
        setCurrent(pick);
    };
    const save = () => { if (!favorites.includes(current)) setFav([current, ...favorites].slice(0,50)); };
    return (
        <Card title="Positive Affirmations">
            <div className="affirm-box">{current}</div>
            <div className="row gap">
                <button className="primary" onClick={next}>New</button>
                <button onClick={save}>Save Favorite</button>
            </div>
            {favorites.length>0 && (
                <div className="affirm-favs">
                    {favorites.map((a,i)=> (
                        <button key={i} className="chip" onClick={()=>setCurrent(a)}>{a}</button>
                    ))}
                </div>
            )}
        </Card>
    );
}

function EmotionSelectorCard() {
    const EMOTIONS = [
        {name:'Calm', color:'#22c55e'}, {name:'Happy', color:'#f59e0b'}, {name:'Grateful', color:'#a3e635'},
        {name:'Stressed', color:'#ef4444'}, {name:'Anxious', color:'#8b5cf6'}, {name:'Sad', color:'#60a5fa'},
        {name:'Angry', color:'#f97316'}, {name:'Lonely', color:'#94a3b8'}, {name:'Inspired', color:'#06b6d4'}
    ];
    const [selected, setSelected] = useUserStorage('emotion.selected', EMOTIONS[0].name);
    const [intensity, setIntensity] = useUserStorage('emotion.intensity', 5);
    return (
        <Card title="Emotion Wheel / Selector">
            <div className="emotion-grid">
                {EMOTIONS.map(e => (
                    <button key={e.name} className={`emotion ${selected===e.name?'on':''}`} style={{'--c': e.color}} onClick={()=>setSelected(e.name)}>{e.name}</button>
                ))}
            </div>
            <label className="emotion-intensity">Intensity: <b>{intensity}</b>/10</label>
            <input type="range" min="0" max="10" value={intensity} onChange={e=>setIntensity(Number(e.target.value))} />
        </Card>
    );
}

function ValuesStrengthsCard() {
    const VALUES = ['Kindness','Growth','Family','Curiosity','Health','Service','Creativity'];
    const STRENGTHS = ['Perseverance','Humor','Fairness','Honesty','Gratitude','Bravery'];
    const [vals, setVals] = useUserStorage('values.selected', []);
    const [strs, setStrs] = useUserStorage('strengths.selected', []);
    const toggle = (list, setter, item) => setter(list.includes(item)? list.filter(x=>x!==item): [...list, item]);
    const summary = vals.length||strs.length ? `You value ${vals.join(', ')} and your strengths include ${strs.join(', ')}.` : 'Pick a few that resonate with you.';
    return (
        <Card title="Values & Strengths">
            <div className="tag-list">
                {VALUES.map(v=> <button key={v} className={`tag-chip ${vals.includes(v)?'on':''}`} onClick={()=>toggle(vals,setVals,v)}>{v}</button>)}
            </div>
            <div className="tag-list" style={{marginTop:8}}>
                {STRENGTHS.map(s=> <button key={s} className={`tag-chip ${strs.includes(s)?'on':''}`} onClick={()=>toggle(strs,setStrs,s)}>{s}</button>)}
            </div>
            <div className="muted" style={{marginTop:8}}>{summary}</div>
        </Card>
    );
}

function GoalsPlannerCard() {
    const [goals, setGoals] = useUserStorage('goals.items', []);
    const [g, setG] = useState({ title:'', specific:'', measurable:'', achievable:'', relevant:'', timebound:'', steps:'' });
    const add = () => {
        if (!g.title.trim()) return;
        const item = { id:Date.now(), ...g, steps: (g.steps||'').split('\n').map(s=>({ id:Math.random(), text:s.trim(), done:false })).filter(s=>s.text) };
        setGoals(prev => [item, ...(prev||[])]);
        setG({ title:'', specific:'', measurable:'', achievable:'', relevant:'', timebound:'', steps:'' });
    };
    const toggleStep = (goalId, stepId) => setGoals(gs=> (gs||[]).map(gl=> gl.id===goalId? {...gl, steps: gl.steps.map(s=> s.id===stepId? {...s, done:!s.done}: s)}: gl));
    const progress = (gl) => gl.steps.length? Math.round(100*gl.steps.filter(s=>s.done).length/gl.steps.length): 0;
    return (
        <Card title="SMART Goals Planner">
            <input placeholder="Goal title" value={g.title} onChange={e=>setG({...g, title:e.target.value})} />
            <input placeholder="Specific" value={g.specific} onChange={e=>setG({...g, specific:e.target.value})} />
            <input placeholder="Measurable" value={g.measurable} onChange={e=>setG({...g, measurable:e.target.value})} />
            <input placeholder="Achievable" value={g.achievable} onChange={e=>setG({...g, achievable:e.target.value})} />
            <input placeholder="Relevant" value={g.relevant} onChange={e=>setG({...g, relevant:e.target.value})} />
            <input placeholder="Time-bound" value={g.timebound} onChange={e=>setG({...g, timebound:e.target.value})} />
            <textarea rows={3} placeholder={'Steps (one per line)'} value={g.steps} onChange={e=>setG({...g, steps:e.target.value})} />
            <button className="primary" onClick={add}>Add Goal</button>
            <div className="goal-list">
                {(goals||[]).map(gl=> (
                    <div key={gl.id} className="goal-item">
                        <div className="goal-title">{gl.title || 'Untitled Goal'}</div>
                        <div className="muted">Specific: {gl.specific || '-'} | Measurable: {gl.measurable || '-'} | Achievable: {gl.achievable || '-'} | Relevant: {gl.relevant || '-'} | Time-bound: {gl.timebound || '-'}</div>
                        <div className="progress"><div className="bar" style={{width: progress(gl)+'%'}} /></div>
                        <div className="steps">
                            {gl.steps.length ? gl.steps.map(s=> (
                                <label key={s.id} className={`step ${s.done?'done':''}`}>
                                    <input type="checkbox" checked={s.done} onChange={()=>toggleStep(gl.id, s.id)} /> {s.text}
                                </label>
                            )) : <div className="muted">No steps yet.</div>}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function RewardsCard() {
    const today = new Date().toISOString().slice(0,10);
    const [last, setLast] = useUserStorage('rewards.last', null);
    const [streak, setStreak] = useUserStorage('rewards.streak', 0);
    const mark = () => {
        if (last === today) return;
        const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
        setStreak(last===yesterday? streak+1 : 1);
        setLast(today);
    };
    const badge = streak>=7? '🌟 7‑day Streak!' : streak>=3? '✨ 3‑day Streak!' : 'Keep going 💚';
    return (
        <Card title="Rewards & Encouragement">
            <div className="streak-box">
                <div className="big">{streak} 🔥</div>
                <div className="muted">Day streak</div>
                <div className="badge-line">{badge}</div>
            </div>
            <button className="primary" onClick={mark}>Mark today’s progress</button>
        </Card>
    );
}

function SoundboardCard() {
    const SOUNDS = [
        {name:'Rain', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'},
        {name:'Forest', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'},
        {name:'Waves', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'},
        {name:'White Noise', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'},
    ];
    const [playing, setPlaying] = useUserStorage('sound.playing', null);
    return (
        <Card title="Soothing Soundboard">
            <div className="sound-grid">
                {SOUNDS.map(s => (
                    <div key={s.name} className={`sound-item ${playing===s.name?'on':''}`}>
                        <div className="sound-name">{s.name}</div>
                        <audio id={`aud-${s.name}`} src={s.src} />
                        {playing===s.name ? (
                            <button onClick={()=>{ const a=document.getElementById(`aud-${s.name}`); a.pause(); setPlaying(null); }}>Pause</button>
                        ) : (
                            <button onClick={()=>{ document.querySelectorAll('.sound-item audio').forEach(a=>a.pause()); const a=document.getElementById(`aud-${s.name}`); a.volume=0.7; a.play(); setPlaying(s.name); }}>Play</button>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
}

function DailySuggestionCard() {
    const IDEAS = [
        'Drink a glass of water and stretch for 1 minute.',
        'Write down one thing you’re grateful for.',
        'Take 5 slow breaths with longer exhales.',
        'Send a kind message to someone you appreciate.',
        'Step outside for 2 minutes of fresh air.',
    ];
    const [suggestion, setSuggestion] = useUserStorage('suggestion.today', { date:'', text: IDEAS[0] });
    const today = new Date().toISOString().slice(0,10);
    useEffect(()=>{
        if (suggestion.date !== today) {
            const text = IDEAS[Math.floor(Math.random()*IDEAS.length)];
            setSuggestion({ date: today, text });
        }
    }, []);
    return (
        <Card title="Today’s Wellness Suggestion">
            <div className="affirm-box">{suggestion.text}</div>
            <div className="muted">Gentle nudge • You’re doing great 💚</div>
            <div className="row gap" style={{marginTop:8}}>
                <button onClick={()=>{
                    const text = IDEAS[Math.floor(Math.random()*IDEAS.length)];
                    setSuggestion({ date: today, text });
                }}>New Suggestion</button>
            </div>
        </Card>
    );
}

function CrisisButton() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button className="crisis-btn" onClick={()=>setOpen(!open)}>Crisis Help</button>
            {open && (
                <div className="crisis-panel">
                    <div className="crisis-title">If you’re in immediate danger, call your local emergency number.</div>
                    <ul>
                        <li><b>India:</b> 1800-599-0019, 1098 (Childline)</li>
                        <li><b>US:</b> 988 Suicide & Crisis Lifeline</li>
                        <li><b>UK:</b> Samaritans 116 123</li>
                    </ul>
                    <a href="tel:988" className="primary" style={{display:'inline-block', marginTop:8}}>Call now</a>
                </div>
            )}
        </>
    );
}

function MoodJournalCard() {
    const [entries, setEntries] = useUserStorage('mood.entries', []);
    const [rating, setRating] = useState(3);
    const [note, setNote] = useState('');
    const today = new Date().toISOString().slice(0,10);
    const add = () => {
        if (!note.trim()) return;
        const e = { id: Date.now(), date: today, rating, note: note.trim() };
        setEntries([e, ...entries].slice(0,100));
        setNote('');
    };
    return (
        <Card title="Mood Tracker / Journal">
            <div className="mood-inputs">
                <label>Today: {today}</label>
                <div className="mood-rating">
                    {[1,2,3,4,5].map(n => (
                        <button key={n} className={`rate ${rating===n?'on':''}`} onClick={()=>setRating(n)}>{n}</button>
                    ))}
                </div>
                <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a short note..." rows={3} />
                <button className="primary" onClick={add}>Save Entry</button>
            </div>
            <div className="mood-list">
                {entries.length===0 ? <div className="muted">No entries yet.</div> : entries.map(e=> (
                    <div key={e.id} className="mood-row">
                        <span className="badge">{e.rating}/5</span>
                        <span className="date">{e.date}</span>
                        <span className="text">{e.note}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function BreathingCard() {
    const PRESETS = [
        { id:'box', label:'Box 4-4-4', inhale:4, hold:4, exhale:4 },
        { id:'478', label:'4-7-8', inhale:4, hold:7, exhale:8 },
    ];
    const [preset, setPreset] = useUserStorage('breathing.preset', PRESETS[0]);
    const [phase, setPhase] = useState('idle');
    const [remaining, setRemaining] = useState(0);
    const [running, setRunning] = useUserStorage('breathing.running', false);
    useEffect(() => {
        if (!running) return;
        let t; let seq = ['inhale','hold','exhale']; let idx = 0;
        const nextPhase = () => {
            const ph = seq[idx%3];
            const dur = ph==='inhale'?preset.inhale: ph==='hold'?preset.hold : preset.exhale;
            setPhase(ph); setRemaining(dur);
            t = setInterval(()=>{
                setRemaining(r=>{
                    if (r<=1) { clearInterval(t); idx++; nextPhase(); return 0; }
                    return r-1;
                });
            },1000);
        };
        nextPhase();
        return ()=> clearInterval(t);
    }, [running, preset]);
    return (
        <Card title="Breathing Exercises">
            <div className="breath-controls">
                <select value={preset.id} onChange={e=>setPreset(PRESETS.find(p=>p.id===e.target.value))}>
                    {PRESETS.map(p=>(<option key={p.id} value={p.id}>{p.label}</option>))}
                </select>
                <button className="primary" onClick={()=>setRunning(!running)}>{running?'Stop':'Start'}</button>
            </div>
            <div className={`breath-anim ${phase}`}>
                <div className="circle" />
                <div className="phase-text">{phase==='idle'?'Ready':phase.toUpperCase()} • {remaining}s</div>
            </div>
        </Card>
    );
}

function CBTReframeCard() {
    const [entries, setEntries] = useUserStorage('cbt.entries', []);
    const TAGS = ['Anxiety','Stress','Motivation','Mood','Sleep','Work','Relationships'];
    const [form, setForm] = useState({
        situation:'', thought:'', evidenceFor:'', evidenceAgainst:'', balanced:'', action:'',
        before:5, after:5, reflection:'', tags:[]
    });
    const toggleTag = (t) => setForm(f => ({ ...f, tags: f.tags.includes(t) ? f.tags.filter(x=>x!==t) : [...f.tags, t] }));
    const save = () => {
        const clean = { ...form };
        // Trim text fields
        ['situation','thought','evidenceFor','evidenceAgainst','balanced','action','reflection'].forEach(k => clean[k] = (clean[k]||'').trim());
        if (!clean.situation || !clean.thought) return;
        clean.id = Date.now();
        setEntries([clean, ...entries].slice(0,50));
        setForm({ situation:'', thought:'', evidenceFor:'', evidenceAgainst:'', balanced:'', action:'', before:5, after:5, reflection:'', tags:[] });
    };
    return (
        <Card title="CBT Thought Reframing" className="tool-wide">
            <div className="cbt-form">
                <input value={form.situation} onChange={e=>setForm({...form, situation:e.target.value})} placeholder="Situation (what happened?)" />
                <input value={form.thought} onChange={e=>setForm({...form, thought:e.target.value})} placeholder="Automatic thought" />
                <div className="cbt-scales">
                    <label>Emotion intensity before: <b>{form.before}</b>/10</label>
                    <input type="range" min="0" max="10" value={form.before} onChange={e=>setForm({...form, before: Number(e.target.value)})} />
                    <label>After reframing: <b>{form.after}</b>/10</label>
                    <input type="range" min="0" max="10" value={form.after} onChange={e=>setForm({...form, after: Number(e.target.value)})} />
                </div>
                <textarea rows={2} value={form.evidenceFor} onChange={e=>setForm({...form, evidenceFor:e.target.value})} placeholder="Evidence supporting the thought" />
                <textarea rows={2} value={form.evidenceAgainst} onChange={e=>setForm({...form, evidenceAgainst:e.target.value})} placeholder="Evidence against the thought" />
                <input value={form.balanced} onChange={e=>setForm({...form, balanced:e.target.value})} placeholder="Balanced alternative thought" />
                <input value={form.action} onChange={e=>setForm({...form, action:e.target.value})} placeholder="Next small action" />
                <textarea rows={2} value={form.reflection} onChange={e=>setForm({...form, reflection:e.target.value})} placeholder="Reflection: What did you learn?" />
                <div className="tag-list">
                    {TAGS.map(t => (
                        <button type="button" key={t} className={`tag-chip ${form.tags.includes(t)?'on':''}`} onClick={()=>toggleTag(t)}>{t}</button>
                    ))}
                </div>
                <button className="primary" onClick={save}>Save</button>
            </div>
            <div className="cbt-list">
                {entries.length===0 ? <div className="muted">No entries yet.</div> : entries.map(e=> (
                    <div key={e.id} className="cbt-entry">
                        <div className="cbt-head">
                            <span className="badge">Before {e.before}/10</span>
                            <span className="badge">After {e.after}/10</span>
                            {e.tags?.length ? <span className="tags">{e.tags.join(' • ')}</span> : null}
                        </div>
                        <div><b>Situation:</b> {e.situation}</div>
                        <div><b>Thought:</b> {e.thought}</div>
                        <div><b>Evidence For:</b> {e.evidenceFor}</div>
                        <div><b>Evidence Against:</b> {e.evidenceAgainst}</div>
                        <div><b>Balanced:</b> {e.balanced}</div>
                        <div><b>Action:</b> {e.action}</div>
                        {e.reflection ? <div><b>Reflection:</b> {e.reflection}</div> : null}
                    </div>
                ))}
            </div>
        </Card>
    );
}

// 🟢 AI RECOMMENDATION PAGE COMPONENT
export default function AiRecommendation() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [activeVideoCategory, setActiveVideoCategory] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // State for AI Bot
    const [botResponse, setBotResponse] = useState('');
    const [botLoading, setBotLoading] = useState(false);


    // 🟢 CORE LOGIC: Calls backend Gemini service for dynamic responses
    const handleBotQuery = async (userPrompt) => {
        if (!currentUser) return;

        setBotLoading(true);
        setBotResponse(prev => `${prev}${prev ? '\n\n' : ''}You: ${userPrompt}\nBot: `);

        try {
            const idToken = await currentUser.getIdToken();
            const enrichedPrompt = `User message: ${userPrompt}`;
            // Try streaming endpoint first
            const streamResp = await fetch(BOT_STREAM_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ prompt: enrichedPrompt }),
            });

            if (streamResp.ok && streamResp.body) {
                const reader = streamResp.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let buffer = '';
                let receivedAny = false;
                for (;;) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    receivedAny = true;
                    buffer += decoder.decode(value, { stream: true });
                    // Parse SSE frames separated by double newlines
                    const frames = buffer.split('\n\n');
                    buffer = frames.pop() || '';
                    for (const frame of frames) {
                        const lines = frame.split('\n');
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const delta = line.slice(6);
                                if (delta.startsWith('[ERROR]')) {
                                    // Cancel streaming and fall back to JSON endpoint
                                    try { await reader.cancel(); } catch(_){}
                                    const response = await fetch(BOT_API_URL, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${idToken}`,
                                        },
                                        body: JSON.stringify({ prompt: enrichedPrompt }),
                                    });
                                    const data = await response.json();
                                    if (!response.ok) {
                                        const backendMessage = data?.error || data?.response;
                                        throw new Error(backendMessage || `Request failed with status ${response.status}`);
                                    }
                                    setBotResponse(prev => prev + (data.response || "I'm sorry, I couldn't generate a response just now."));
                                    return;
                                }
                                // Append token
                                setBotResponse(prev => prev + delta);
                            }
                        }
                    }
                }
                // If stream ended without any data, fall back once
                if (!receivedAny) {
                    const response = await fetch(BOT_API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${idToken}`,
                        },
                        body: JSON.stringify({ prompt: enrichedPrompt }),
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        const backendMessage = data?.error || data?.response;
                        throw new Error(backendMessage || `Request failed with status ${response.status}`);
                    }
                    setBotResponse(prev => prev + (data.response || "I'm sorry, I couldn't generate a response just now."));
                }
            } else {
                // Fallback to non-streaming endpoint
                const response = await fetch(BOT_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({ prompt: enrichedPrompt }),
                });
                const data = await response.json();
                if (!response.ok) {
                    const backendMessage = data?.error || data?.response;
                    throw new Error(backendMessage || `Request failed with status ${response.status}`);
                }
                setBotResponse(prev => prev + (data.response || "I'm sorry, I couldn't generate a response just now."));
            }
        } catch (error) {
            console.error("Bot Query Error:", error);
            setBotResponse(`Error: Unable to reach BloomBot at the moment. Details: ${error.message}`);
        } finally {
            setBotLoading(false);
        }
    };

    // Filter logic (unchanged)
    const handleCategoryClick = (category) => {
        if (activeVideoCategory === category) {
            setActiveVideoCategory(null);
        } else {
            setActiveVideoCategory(category);
        }
        setIsExpanded(false);
    };

    let filteredVideos = activeVideoCategory
        ? VIDEOS_DATA.filter(video => video.category === activeVideoCategory)
        : VIDEOS_DATA;

    // Display 3 for consistent layout
    const displayLimit = 3;
    const videosToShow = isExpanded ? filteredVideos : filteredVideos.slice(0, displayLimit);
    const showMoreButton = filteredVideos.length > displayLimit && !isExpanded;


    const { featured, standard, miniStack } = getArticleLayoutSlots(ARTICLES_DATA);


    return (
        <div className="recommendation-page-container">
            {/* --- Main Content --- */}
            <div className="page-header">
                <div>
                    <h1 className="page-main-title">Personalized Wellness Insights</h1>
                    <p className="page-subtitle">Explore articles and videos tailored to enhance your mental well-being.</p>
                </div>
                <motion.button
                    onClick={() => navigate('/')}
                    className="home-button"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    aria-label="Go to Home"
                >
                    <Home size={20} className="home-icon" />
                    <span>Go to Home</span>
                </motion.button>
            </div>

            {/* ... (Articles Section) ... */}
            <section className="articles-section">
                <motion.h2
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="section-title"
                >
                    Recommended Articles
                </motion.h2>

                <div className="articles-balanced-container">

                    <div className="articles-column articles-column-left">
                        {featured && <ArticleCard article={featured} className="featured-card" />}
                        {standard && <ArticleCard article={standard} className="standard-card" />}
                    </div>
                    <div className="articles-column articles-column-right">
                        {miniStack.map(article => (
                            <ArticleCard key={article.id} article={article} className="mini-card" />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Videos Section (Dynamic Filtering) --- */}
            <section className="videos-section">
                <motion.h2
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="section-title"
                >
                    Expert-Recommended Videos
                </motion.h2>

                {/* Video Category Tags (Filtering UI) */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="video-categories-filter"
                >
                    <button
                        className={`category-tag ${activeVideoCategory === null ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(null)}
                    >
                        All Topics ({VIDEOS_DATA.length})
                    </button>
                    {VIDEO_CATEGORIES.map(category => (
                        <button
                            key={category}
                            className={`category-tag ${activeVideoCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* Filtered Videos Grid */}
                <div className="videos-grid">
                    {videosToShow.length > 0 ? (
                        videosToShow.map(video => (
                            <VideoCard key={video.id} video={video} />
                        ))
                    ) : (
                        <motion.p
                            className="no-videos-message"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            No videos available for this topic. Try selecting another one!
                        </motion.p>
                    )}
                </div>

                {/* "More Videos" Button (Conditional Visibility) */}
                {showMoreButton && (
                    <div className="show-more-wrapper">
                        <button
                            className="show-more-btn"
                            onClick={() => setIsExpanded(true)}
                        >
                            Show More Videos ({filteredVideos.length - videosToShow.length} remaining) ↓
                        </button>
                    </div>
                )}
            </section>

            {/* 🟢 FINAL CHAT INPUT BOX RENDERED AT THE BOTTOM */}
            <section className="ai-chat-section">
                <ChatInputBox
                    onSubmit={handleBotQuery}
                    isLoading={botLoading}
                    currentUser={currentUser}
                    lastResponse={botResponse}
                />
            </section>

            {/* 🟢 SELF-HELP TOOLS */}
            <section className="self-help-section">
                <motion.h2
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="section-title"
                >
                    Self-Help Tools
                </motion.h2>

                <div className="tools-grid">
                    <MeditationCard />
                    <MoodJournalCard />
                    <BreathingCard />
                    <AffirmationsCard />
                    <EmotionSelectorCard />
                    <ValuesStrengthsCard />
                    <GoalsPlannerCard />
                    <div className="tool-stack">
                        <RewardsCard />
                        <DailySuggestionCard />
                    </div>
                    <SoundboardCard />
                    <CBTReframeCard />
                </div>
            </section>
            <CrisisButton />
        </div>
    );
}
