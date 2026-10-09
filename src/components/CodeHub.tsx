import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Plus, 
  Search, 
  Tag, 
  Sparkles, 
  FileCode, 
  Terminal, 
  Cpu, 
  SlidersHorizontal 
} from 'lucide-react';
import { CodeSnippet, WiFiPMotorDevice, MotorLicense } from '../types';

interface CodeHubProps {
  snippets: CodeSnippet[];
  onAddSnippet: (snippet: CodeSnippet) => void;
  onUpdateSnippet: (snippet: CodeSnippet) => void;
  devices: WiFiPMotorDevice[];
  licenses: MotorLicense[];
}

export const CodeHub: React.FC<CodeHubProps> = ({
  snippets,
  onAddSnippet,
  onUpdateSnippet,
  devices,
  licenses,
}) => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(snippets[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Dynamic injector parameters
  const [injectDeviceMac, setInjectDeviceMac] = useState(devices[0]?.macAddress || '24:6F:28:7A:B1:9C');
  const [injectLicenseKey, setInjectLicenseKey] = useState(licenses[0]?.licenseKey || 'PMOTOR-PRO-9F8A-7C2B-E410-WIFI');

  // New snippet form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CodeSnippet['category']>('Motor Control');
  const [newLang, setNewLang] = useState<CodeSnippet['language']>('arduino');
  const [newDesc, setNewDesc] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newTags, setNewTags] = useState('WiFi PMotor, ESP32');

  const activeSnippet = snippets.find((s) => s.id === selectedSnippetId) || snippets[0];

  // Process code with injected device MAC and License Key
  const getProcessedCode = (rawCode: string) => {
    if (!rawCode) return '';
    return rawCode
      .replace(/PMOTOR-PRO-9F8A-7C2B-E410-WIFI/g, injectLicenseKey)
      .replace(/24:6F:28:7A:B1:9C/g, injectDeviceMac);
  };

  const handleCopyCode = () => {
    if (!activeSnippet) return;
    const finalCode = getProcessedCode(activeSnippet.code);
    navigator.clipboard.writeText(finalCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    if (!activeSnippet) return;
    const finalCode = getProcessedCode(activeSnippet.code);
    const extension =
      activeSnippet.language === 'arduino'
        ? 'ino'
        : activeSnippet.language === 'micropython'
        ? 'py'
        : activeSnippet.language === 'json'
        ? 'json'
        : 'txt';
    const filename = `${activeSnippet.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${extension}`;

    const blob = new Blob([finalCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCreateSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    const snippet: CodeSnippet = {
      id: `CODE-${Math.floor(Math.random() * 899 + 100)}`,
      title: newTitle || 'Custom WiFi PMotor Script',
      category: newCategory,
      language: newLang,
      description: newDesc,
      code: newCode,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onAddSnippet(snippet);
    setSelectedSnippetId(snippet.id);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewCode('');
  };

  const filteredSnippets = snippets.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            Code Manager - Firmware & Control Scripts
          </h2>
          <p className="text-xs text-slate-400">
            Repository of Arduino C++, MicroPython, MQTT, and G-Code programs for WiFi PMotor drivers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center space-x-1.5 shadow-md shadow-cyan-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Script Template</span>
        </button>
      </div>

      {/* Main Grid: Left List, Right Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Snippet Catalog */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search code snippets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
              {['all', 'License Verification', 'Motor Control', 'Telemetry & MQTT', 'Safety Routine'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'All Scripts' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Snippet Card List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredSnippets.map((snippet) => {
              const isSelected = snippet.id === activeSnippet?.id;
              return (
                <div
                  key={snippet.id}
                  onClick={() => setSelectedSnippetId(snippet.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/20'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-xs text-white line-clamp-1">{snippet.title}</span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        snippet.language === 'arduino'
                          ? 'bg-blue-950 text-blue-400 border border-blue-900'
                          : snippet.language === 'micropython'
                          ? 'bg-yellow-950 text-yellow-400 border border-yellow-900'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {snippet.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{snippet.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="text-cyan-400/80">{snippet.category}</span>
                    <span>{snippet.updatedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer & Injector */}
        <div className="lg:col-span-8 space-y-4">
          {activeSnippet ? (
            <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
              {/* Snippet Details Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <FileCode className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-white text-sm">{activeSnippet.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{activeSnippet.description}</p>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadCode}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 flex items-center space-x-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Parameter Injector Bar */}
              <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-400 flex items-center gap-1 font-semibold">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                  Live Injector:
                </span>

                <div className="flex items-center space-x-1.5">
                  <span className="text-slate-400 text-[11px]">Motor MAC:</span>
                  <select
                    value={injectDeviceMac}
                    onChange={(e) => setInjectDeviceMac(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    {devices.map((d) => (
                      <option key={d.id} value={d.macAddress}>
                        {d.name} ({d.macAddress})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-slate-400 text-[11px]">License:</span>
                  <select
                    value={injectLicenseKey}
                    onChange={(e) => setInjectLicenseKey(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-purple-500 max-w-[200px]"
                  >
                    {licenses.map((l) => (
                      <option key={l.id} value={l.licenseKey}>
                        {l.tier} - {l.licenseKey}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Code Pre Area with Line Numbers */}
              <div className="p-4 bg-slate-950 overflow-x-auto font-mono text-xs text-slate-200 max-h-[520px]">
                <pre className="leading-relaxed whitespace-pre font-mono">
                  <code>{getProcessedCode(activeSnippet.code)}</code>
                </pre>
              </div>

              {/* Footer with tags */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {activeSnippet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-slate-500 text-[11px]">Language: {activeSnippet.language.toUpperCase()}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
              Select or create a script snippet to inspect.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Script Template */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSnippet}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Add WiFi PMotor Script</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Script Title:</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. WiFi PMotor CAN-Bus Telemetry Gateway"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="License Verification">License Verification</option>
                  <option value="Motor Control">Motor Control</option>
                  <option value="WiFi Networking">WiFi Networking</option>
                  <option value="Telemetry & MQTT">Telemetry & MQTT</option>
                  <option value="Safety Routine">Safety Routine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Language:</label>
                <select
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="arduino">Arduino / C++ (ESP32)</option>
                  <option value="micropython">MicroPython</option>
                  <option value="json">JSON Configuration</option>
                  <option value="gcode">G-Code / Movement</option>
                  <option value="bash">cURL / Shell</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Description:</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Brief summary of script functionality"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Source Code:</label>
              <textarea
                rows={8}
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="// Enter motor code or paste script here..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow"
              >
                Save Script
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
