
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../AppContext';
import { AppData, PolicySection } from '../../types';
import { Save, ArrowLeft, Plus, Trash2, Smartphone, Globe, Shield, Activity, Layers, Type } from 'lucide-react';
import { availableIcons } from '../../utils/iconMap';

// Markdown parser function to convert markdown text to sections (returns title and content as strings)
const parseMarkdownToSections = (markdown: string): Array<{ title: string; content: string }> => {
  if (!markdown.trim()) return [];
  
  const sections: Array<{ title: string; content: string }> = [];
  const lines = markdown.split('\n');
  let currentTitle = '';
  let currentContent: string[] = [];
  let hasAnyHeading = false;
  
  for (const line of lines) {
    // Check if line is a heading (starts with #)
    const headingMatch = line.match(/^#+\s*(.+)$/);
    if (headingMatch) {
      hasAnyHeading = true;
      // Save previous section if exists
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          content: currentContent.join('\n').trim()
        });
      }
      // Start new section
      currentTitle = headingMatch[1].trim();
      currentContent = [];
    } else {
      // Add to current content
      if (line.trim() || currentContent.length > 0) {
        currentContent.push(line);
      }
    }
  }
  
  // Don't forget the last section
  if (currentTitle) {
    sections.push({
      title: currentTitle,
      content: currentContent.join('\n').trim()
    });
  }
  
  // If no headings found but there's content, create a single section
  if (!hasAnyHeading && markdown.trim()) {
    sections.push({
      title: 'Privacy Policy',
      content: markdown.trim()
    });
  }
  
  return sections;
};

// Convert PolicySection array to markdown format
const policyToMarkdown = (sections: PolicySection[], lang: 'en' | 'tr'): string => {
  if (sections.length === 0) return '';
  return sections.map(section => {
    const title = section.title[lang] || '';
    const content = section.content[lang] || '';
    if (!title && !content) return '';
    return `# ${title}\n\n${content}`;
  }).filter(s => s).join('\n\n');
};

const emptyApp: AppData = {
  id: '',
  name: '',
  tagline: { en: '', tr: '' },
  description: { en: '', tr: '' },
  iconUrl: 'https://picsum.photos/200',
  screenshots: [],
  features: [],
  downloadLink: '',
  category: { en: '', tr: '' },
  rating: 5.0,
  reviewsCount: 0,
  version: '1.0.0',
  lastUpdated: { en: '', tr: '' },
  privacyPolicy: []
};

// Reusable Components moved outside to prevent re-creation on render
const InputGroup = ({ label, children, className = "" }: { label: string, children: React.ReactNode, className?: string }) => (
  <div className={className}>
    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider flex items-center gap-1">
      {label}
    </label>
    {children}
  </div>
);

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm"
    {...props} 
  />
);

const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => (
  <textarea 
    ref={ref}
    className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm leading-relaxed"
    {...props} 
  />
));
TextArea.displayName = 'TextArea';

const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab }: { id: 'basic' | 'features' | 'policy', label: string, icon: any, activeTab: string, setActiveTab: (id: any) => void }) => (
  <button
    type="button"
    onClick={() => setActiveTab(id)}
    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
      activeTab === id 
        ? 'border-primary text-primary bg-primary/5' 
        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const AppEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getApp, addApp, updateApp, deleteApp } = useApp();
  const [formData, setFormData] = useState<AppData>(emptyApp);
  const [originalId, setOriginalId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'basic' | 'features' | 'policy'>('basic');
  const [policyMarkdownEn, setPolicyMarkdownEn] = useState('');
  const [policyMarkdownTr, setPolicyMarkdownTr] = useState('');
  const markdownEnRef = useRef<HTMLTextAreaElement>(null);
  const markdownTrRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (id) {
      const app = getApp(id);
      if (app) {
        setFormData(app);
        setOriginalId(app.id); // Store original ID to detect changes
        // Convert existing policy to markdown
        setPolicyMarkdownEn(policyToMarkdown(app.privacyPolicy, 'en'));
        setPolicyMarkdownTr(policyToMarkdown(app.privacyPolicy, 'tr'));
      }
    } else {
      // Reset markdown when creating new app
      setPolicyMarkdownEn('');
      setPolicyMarkdownTr('');
      setOriginalId('');
    }
  }, [id, getApp]);

  const handleChange = (field: keyof AppData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocalizedChange = (field: 'tagline' | 'description' | 'category' | 'lastUpdated', lang: 'en' | 'tr', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }));
  };

  // Feature Handlers
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { title: { en: '', tr: '' }, description: { en: '', tr: '' }, iconName: 'Activity' }]
    }));
  };

  const removeFeature = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const updateFeature = (idx: number, field: string, value: any, lang?: 'en' | 'tr') => {
    const newFeatures = [...formData.features];
    if (lang) {
      // @ts-ignore
      newFeatures[idx][field][lang] = value;
    } else {
      // @ts-ignore
      newFeatures[idx][field] = value;
    }
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  // Privacy Policy Handlers - now handled via markdown

  // Handle markdown changes and convert to policy sections
  const handleMarkdownChange = (lang: 'en' | 'tr', value: string) => {
    // Update the markdown state
    if (lang === 'en') {
      setPolicyMarkdownEn(value);
    } else {
      setPolicyMarkdownTr(value);
    }
    
    // Get current markdown values (use updated value for the current lang)
    const currentEn = lang === 'en' ? value : policyMarkdownEn;
    const currentTr = lang === 'tr' ? value : policyMarkdownTr;
    
    // Parse both markdowns
    const sectionsEn = parseMarkdownToSections(currentEn);
    const sectionsTr = parseMarkdownToSections(currentTr);
    
    // Merge sections - use the maximum length
    const maxLength = Math.max(sectionsEn.length, sectionsTr.length);
    const mergedSections: PolicySection[] = [];
    
    for (let i = 0; i < maxLength; i++) {
      const enSection = sectionsEn[i];
      const trSection = sectionsTr[i];
      
      mergedSections.push({
        title: {
          en: enSection?.title || formData.privacyPolicy[i]?.title.en || '',
          tr: trSection?.title || formData.privacyPolicy[i]?.title.tr || ''
        },
        content: {
          en: enSection?.content || formData.privacyPolicy[i]?.content.en || '',
          tr: trSection?.content || formData.privacyPolicy[i]?.content.tr || ''
        }
      });
    }
    
    setFormData(prev => ({ ...prev, privacyPolicy: mergedSections }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get markdown values directly from textarea refs (most reliable)
      const currentEn = markdownEnRef.current?.value || policyMarkdownEn || '';
      const currentTr = markdownTrRef.current?.value || policyMarkdownTr || '';
      
      console.log('Submit - Markdown values:', { 
        enLength: currentEn.length, 
        trLength: currentTr.length,
        en: currentEn.substring(0, 200),
        tr: currentTr.substring(0, 200)
      });
      
      // Parse markdown to sections
      const sectionsEn = parseMarkdownToSections(currentEn);
      const sectionsTr = parseMarkdownToSections(currentTr);
      
      console.log('Submit - Parsed sections:', { 
        enSections: sectionsEn.length, 
        trSections: sectionsTr.length,
        sectionsEn: sectionsEn.map(s => ({ title: s.title, contentLength: s.content.length })),
        sectionsTr: sectionsTr.map(s => ({ title: s.title, contentLength: s.content.length }))
      });
      
      // Merge sections - use the maximum length
      const maxLength = Math.max(sectionsEn.length, sectionsTr.length, 0);
      const mergedSections: PolicySection[] = [];
      
      for (let i = 0; i < maxLength; i++) {
        const enSection = sectionsEn[i];
        const trSection = sectionsTr[i];
        
        mergedSections.push({
          title: {
            en: enSection?.title || '',
            tr: trSection?.title || ''
          },
          content: {
            en: enSection?.content || '',
            tr: trSection?.content || ''
          }
        });
      }
      
      console.log('Submit - Merged sections:', {
        count: mergedSections.length,
        sections: mergedSections.map(s => ({
          titleEn: s.title.en,
          titleTr: s.title.tr,
          contentEnLength: s.content.en.length,
          contentTrLength: s.content.tr.length
        }))
      });
      
      // Update formData with latest privacyPolicy
      const finalFormData = {
        ...formData,
        privacyPolicy: mergedSections
      };
      
      console.log('Submit - Final formData:', {
        id: finalFormData.id,
        name: finalFormData.name,
        privacyPolicyLength: finalFormData.privacyPolicy.length,
        privacyPolicy: finalFormData.privacyPolicy
      });
      
      if (id) {
        // Check if ID has changed
        if (finalFormData.id && finalFormData.id !== originalId) {
          // ID changed: update using old ID
          await updateApp(finalFormData, originalId);
        } else {
          // ID unchanged: normal update
          await updateApp(finalFormData);
        }
      } else {
        // Use provided ID or generate from name
        const newId = finalFormData.id || finalFormData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        await addApp({ ...finalFormData, id: newId });
      }
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving app:', error);
      alert('App kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };



  return (
    <div className="min-h-screen bg-dark pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/admin/dashboard')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{id ? 'Edit Application' : 'Create New Application'}</h1>
              <p className="text-gray-500 text-sm mt-1">{id ? `Editing: ${formData.name}` : 'Fill in the details below'}</p>
            </div>
          </div>
          <button onClick={handleSubmit} className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 justify-center">
             <Save className="w-5 h-5" />
             <span>Save Changes</span>
          </button>
        </div>

        <div className="bg-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-white/10 overflow-x-auto bg-darker/30">
            <TabButton id="basic" label="Basic Information" icon={Smartphone} activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="features" label="Features" icon={Layers} activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="policy" label="Privacy Policy" icon={Shield} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="p-6 md:p-10">
            <form onSubmit={handleSubmit}>
              
              {/* BASIC TAB */}
              {activeTab === 'basic' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  
                  {/* Left Column: Core Settings */}
                  <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-6">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-primary" /> Core Settings
                      </h3>
                      
                      <InputGroup label="App Name">
                        <TextInput required value={formData.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. FitTrack Pro" />
                      </InputGroup>
                      
                      <InputGroup label="App ID">
                         <TextInput 
                           value={formData.id || ''} 
                           onChange={e => handleChange('id', e.target.value)} 
                           placeholder="e.g. my-app-id"
                           required
                         />
                      </InputGroup>

                      <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Version">
                          <TextInput value={formData.version} onChange={e => handleChange('version', e.target.value)} placeholder="1.0.0" />
                        </InputGroup>
                        <InputGroup label="Rating">
                          <TextInput type="number" step="0.1" max="5.0" value={formData.rating} onChange={e => handleChange('rating', parseFloat(e.target.value))} />
                        </InputGroup>
                      </div>

                      <InputGroup label="Icon URL">
                        <div className="flex gap-4 items-start">
                          <div className="w-14 h-14 rounded-xl bg-darker/50 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                             {formData.iconUrl ? <img src={formData.iconUrl} alt="Preview" className="w-full h-full object-cover" /> : <Smartphone className="text-gray-600" />}
                          </div>
                          <TextInput value={formData.iconUrl} onChange={e => handleChange('iconUrl', e.target.value)} placeholder="https://..." />
                        </div>
                      </InputGroup>

                      <InputGroup label="Download Link">
                         <TextInput value={formData.downloadLink} onChange={e => handleChange('downloadLink', e.target.value)} placeholder="https://apps.apple.com..." />
                      </InputGroup>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Screenshots</h3>
                        <InputGroup label="Image URLs (Comma separated)">
                          <TextArea 
                            className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono h-32"
                            value={formData.screenshots.join(',\n')} 
                            onChange={e => handleChange('screenshots', e.target.value.split(',').map(s => s.trim()))} 
                            placeholder="https://site.com/img1.jpg,&#10;https://site.com/img2.jpg"
                          />
                        </InputGroup>
                    </div>
                  </div>

                  {/* Right Column: Localization */}
                  <div className="xl:col-span-2 space-y-6">
                    
                    {/* English Section */}
                    <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                      <div className="bg-blue-500/10 border-b border-blue-500/10 px-6 py-4 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-6 h-4 rounded-sm bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">EN</div>
                            <h3 className="text-base font-semibold text-white">English Content</h3>
                         </div>
                         <Globe className="w-4 h-4 text-blue-500" />
                      </div>
                      
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputGroup label="Category">
                            <TextInput value={formData.category.en} onChange={e => handleLocalizedChange('category', 'en', e.target.value)} />
                          </InputGroup>
                          <InputGroup label="Last Updated Text">
                            <TextInput value={formData.lastUpdated.en} onChange={e => handleLocalizedChange('lastUpdated', 'en', e.target.value)} />
                          </InputGroup>
                        </div>
                        <InputGroup label="Tagline (Short Slogan)">
                          <TextInput value={formData.tagline.en} onChange={e => handleLocalizedChange('tagline', 'en', e.target.value)} />
                        </InputGroup>
                        <InputGroup label="Full Description">
                          <TextArea 
                            value={formData.description.en} 
                            onChange={e => handleLocalizedChange('description', 'en', e.target.value)} 
                            className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm leading-relaxed min-h-[160px]"
                          />
                        </InputGroup>
                      </div>
                    </div>

                    {/* Turkish Section */}
                    <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                      <div className="bg-red-500/10 border-b border-red-500/10 px-6 py-4 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-6 h-4 rounded-sm bg-red-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">TR</div>
                            <h3 className="text-base font-semibold text-white">Turkish Content</h3>
                         </div>
                         <Globe className="w-4 h-4 text-red-500" />
                      </div>
                      
                      <div className="p-6 space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputGroup label="Category">
                            <TextInput value={formData.category.tr} onChange={e => handleLocalizedChange('category', 'tr', e.target.value)} />
                          </InputGroup>
                          <InputGroup label="Last Updated Text">
                            <TextInput value={formData.lastUpdated.tr} onChange={e => handleLocalizedChange('lastUpdated', 'tr', e.target.value)} />
                          </InputGroup>
                        </div>
                        <InputGroup label="Tagline (Kısa Slogan)">
                          <TextInput value={formData.tagline.tr} onChange={e => handleLocalizedChange('tagline', 'tr', e.target.value)} />
                        </InputGroup>
                        <InputGroup label="Full Description (Detaylı Açıklama)">
                          <TextArea 
                            value={formData.description.tr} 
                            onChange={e => handleLocalizedChange('description', 'tr', e.target.value)} 
                            className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm leading-relaxed min-h-[160px]"
                          />
                        </InputGroup>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* FEATURES TAB */}
              {activeTab === 'features' && (
                <div className="space-y-8 max-w-5xl mx-auto">
                   <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Features List</h3>
                        <p className="text-sm text-gray-500 mt-1">Add features to highlight key capabilities.</p>
                      </div>
                      <button type="button" onClick={addFeature} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" /> Add Feature
                      </button>
                   </div>
                   
                   <div className="space-y-6">
                    {formData.features.map((feature, idx) => (
                      <div key={idx} className="bg-card p-6 rounded-2xl border border-white/5 relative group hover:border-white/20 transition-all shadow-xl">
                          <button type="button" onClick={() => removeFeature(idx)} className="absolute top-4 right-4 w-8 h-8 bg-white/5 hover:bg-red-500 hover:text-white text-gray-500 rounded-lg flex items-center justify-center transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="flex flex-col md:flex-row gap-8">
                            {/* Icon Selection */}
                            <div className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6">
                               <InputGroup label="Feature Icon">
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                      <Type className="w-4 h-4" />
                                    </div>
                                    <select 
                                      className="w-full bg-darker/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
                                      value={feature.iconName} 
                                      onChange={(e) => updateFeature(idx, 'iconName', e.target.value)}
                                    >
                                      {availableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                    </select>
                                  </div>
                                  <div className="mt-4 bg-darker/30 rounded-xl p-8 flex justify-center border border-white/5 border-dashed">
                                     <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                        {/* Simple preview if possible, but just placeholder for now */}
                                        <Activity className="w-8 h-8" />
                                     </div>
                                  </div>
                               </InputGroup>
                            </div>

                            {/* Content */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-2">
                                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                     <span className="text-xs font-bold text-blue-400 tracking-wider">ENGLISH</span>
                                  </div>
                                  <InputGroup label="Title">
                                    <TextInput value={feature.title.en} onChange={e => updateFeature(idx, 'title', e.target.value, 'en')} />
                                  </InputGroup>
                                  <InputGroup label="Description">
                                    <TextArea value={feature.description.en} onChange={e => updateFeature(idx, 'description', e.target.value, 'en')} className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white transition-all text-sm min-h-[100px]" />
                                  </InputGroup>
                               </div>

                               <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-2">
                                     <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                     <span className="text-xs font-bold text-red-400 tracking-wider">TURKISH</span>
                                  </div>
                                  <InputGroup label="Title">
                                    <TextInput value={feature.title.tr} onChange={e => updateFeature(idx, 'title', e.target.value, 'tr')} />
                                  </InputGroup>
                                  <InputGroup label="Description">
                                    <TextArea value={feature.description.tr} onChange={e => updateFeature(idx, 'description', e.target.value, 'tr')} className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white transition-all text-sm min-h-[100px]" />
                                  </InputGroup>
                               </div>
                            </div>
                          </div>
                      </div>
                    ))}
                   </div>
                   {formData.features.length === 0 && (
                     <div className="text-center py-16 bg-white/5 rounded-2xl border-2 border-dashed border-white/10">
                       <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                       <p className="text-gray-400 font-medium">No features added yet.</p>
                       <p className="text-gray-600 text-sm mt-1 mb-4">Add features to describe what makes your app special.</p>
                       <button type="button" onClick={addFeature} className="text-primary hover:text-white font-semibold transition-colors">
                         + Add your first feature
                       </button>
                     </div>
                   )}
                </div>
              )}

              {/* POLICY TAB */}
              {activeTab === 'policy' && (
                 <div className="space-y-8 max-w-6xl mx-auto">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold text-white">Privacy Policy (Markdown Format)</h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        Write your privacy policy in Markdown format. Use <code className="bg-darker px-1.5 py-0.5 rounded text-xs"># Section Title</code> for headings. 
                        Supports <strong>bold</strong>, <em>italic</em>, emojis 🎉, and more. Each heading creates a new section.
                      </p>
                      <div className="mt-4 p-4 bg-darker/50 rounded-xl border border-white/5">
                        <p className="text-xs text-gray-400 font-mono mb-2">Example:</p>
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">
{`# 1. Data Collection 🔒

We collect **anonymous** usage data to improve our services. Personal information is only collected with your explicit consent.

# 2. Usage of Data 📊

Data is used to personalize the app experience and fix technical issues. We never sell your data to third parties.`}
                        </pre>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* English Markdown Editor */}
                     <div className="bg-card rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                       <div className="bg-blue-500/10 border-b border-blue-500/10 px-6 py-4 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-4 rounded-sm bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">EN</div>
                           <h4 className="text-base font-semibold text-white">English Content</h4>
                         </div>
                         <Globe className="w-4 h-4 text-blue-500" />
                       </div>
                       <div className="p-6">
                         <InputGroup label="Markdown Content">
                           <TextArea 
                             ref={markdownEnRef}
                             value={policyMarkdownEn}
                             onChange={e => handleMarkdownChange('en', e.target.value)}
                             className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm leading-relaxed min-h-[500px] font-mono"
                             placeholder={`# 1. Data Collection 🔒\n\nWe collect **anonymous** usage data...\n\n# 2. Usage of Data 📊\n\nData is used to...`}
                           />
                         </InputGroup>
                       </div>
                     </div>

                     {/* Turkish Markdown Editor */}
                     <div className="bg-card rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                       <div className="bg-red-500/10 border-b border-red-500/10 px-6 py-4 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-4 rounded-sm bg-red-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">TR</div>
                           <h4 className="text-base font-semibold text-white">Turkish Content</h4>
                         </div>
                         <Globe className="w-4 h-4 text-red-500" />
                       </div>
                       <div className="p-6">
                         <InputGroup label="Markdown İçeriği">
                           <TextArea 
                             ref={markdownTrRef}
                             value={policyMarkdownTr}
                             onChange={e => handleMarkdownChange('tr', e.target.value)}
                             className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm leading-relaxed min-h-[500px] font-mono"
                             placeholder={`# 1. Veri Toplama 🔒\n\nAnonim kullanım verileri topluyoruz...\n\n# 2. Verilerin Kullanımı 📊\n\nVeriler...`}
                           />
                         </InputGroup>
                       </div>
                     </div>
                   </div>

                   {/* Preview Section Count */}
                   {formData.privacyPolicy.length > 0 && (
                     <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                       <div className="flex items-center gap-2 text-sm text-gray-400">
                         <Shield className="w-4 h-4" />
                         <span>Parsed <strong className="text-white">{formData.privacyPolicy.length}</strong> section(s) from markdown</span>
                       </div>
                     </div>
                   )}

                 </div>
              )}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppEditor;
