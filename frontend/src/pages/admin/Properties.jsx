import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  X, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Trash2,
  DollarSign,
  Briefcase,
  Home
} from 'lucide-react';
import { propertyApi } from '../../api';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    property_type: 'Flat',
    ownership: 'Our Project',
    details: '{}'
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await propertyApi.getAll();
      setProperties(data);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    selectedFiles.forEach(file => data.append('media', file));

    try {
      await propertyApi.create(data);
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        location: '',
        property_type: 'Flat',
        ownership: 'Our Project',
        details: '{}'
      });
      setSelectedFiles([]);
      fetchProperties();
    } catch (err) {
      alert('Failed to list property. Check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this property?')) return;
    try {
      await propertyApi.delete(id);
      fetchProperties();
    } catch (err) {
      alert('Failed to delete property');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-heading">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-indigo-950 tracking-tight flex items-center gap-3">
            Inventory <span className="text-primary/40">Hub</span>
          </h1>
          <p className="text-[#6B7280] font-medium mt-2">Manage your luxury listings and external properties.</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white h-14 px-8 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95"
        >
          <Plus size={20} /> List New Property
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white h-[450px] rounded-[40px] animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => {
            const media = JSON.parse(prop.media || '[]');
            const thumbnail = media.length > 0 ? `http://localhost:5000${media[0]}` : null;
            
            return (
              <div key={prop.id} className="group bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                <div className="relative h-64 bg-gray-100">
                  {thumbnail ? (
                    <img src={thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={prop.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon size={64} />
                    </div>
                  )}
                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg backdrop-blur-md ${prop.ownership === 'Our Project' ? 'bg-indigo-600/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                      {prop.ownership}
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-white/90 text-primary text-[10px] font-black uppercase tracking-tighter shadow-lg backdrop-blur-md">
                      {prop.property_type}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-xl font-black text-indigo-950 truncate">{prop.name}</h3>
                    <div className="text-2xl font-black text-primary">₹{(prop.price/100000).toFixed(1)}L+</div>
                  </div>

                  <div className="flex items-center gap-2 text-[#6B7280] font-medium mb-8">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-sm">{prop.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex gap-2">
                       {media.length > 0 && <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><ImageIcon size={12}/> {media.length} Files</span>}
                    </div>
                    <button 
                      onClick={() => handleDelete(prop.id)}
                      className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-indigo-950/20">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-3xl overflow-hidden animate-in fade-in zoom-in duration-300 h-[90vh] flex flex-col">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between shrink-0">
              <h2 className="text-3xl font-black text-indigo-950">Add Property <span className="text-primary/40">Details</span></h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-3 hover:bg-gray-50 rounded-full transition-all text-gray-400"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1">Property Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Skyline Residency"
                      className="w-full h-14 bg-[#F9FAFB] border-0 rounded-2xl px-6 font-medium text-indigo-950 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1">Location</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Sector 12, Chandigarh"
                      className="w-full h-14 bg-[#F9FAFB] border-0 rounded-2xl px-6 font-medium text-indigo-950 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1">Price (₹)</label>
                      <input 
                        type="number" 
                        placeholder="5500000"
                        className="w-full h-14 bg-[#F9FAFB] border-0 rounded-2xl px-6 font-medium text-indigo-950 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1">Type</label>
                      <select 
                        className="w-full h-14 bg-[#F9FAFB] border-0 rounded-2xl px-6 font-medium text-indigo-950 focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                        value={formData.property_type}
                        onChange={(e) => setFormData({...formData, property_type: e.target.value})}
                      >
                        <option>Flat</option>
                        <option>Villa</option>
                        <option>Plot</option>
                        <option>Commercial</option>
                        <option>Penthouse</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1">Project Ownership</label>
                    <div className="flex gap-2">
                       {['Our Project', 'Third-party'].map(type => (
                         <button
                           key={type}
                           type="button"
                           onClick={() => setFormData({...formData, ownership: type})}
                           className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all ${formData.ownership === type ? 'bg-indigo-900 border-indigo-900 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1">Description</label>
                    <textarea 
                      rows="4" 
                      className="w-full bg-[#F9FAFB] border-0 rounded-2xl px-6 py-4 font-medium text-indigo-950 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                      placeholder="Highlight key features..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* MEDIA UPLOAD SECTION */}
              <div className="mb-12">
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-4 px-1 text-center">Multi-media (Photos & Videos)</label>
                <div className="border-2 border-dashed border-gray-100 rounded-[30px] p-8 text-center hover:bg-indigo-50/30 transition-all group">
                   <input 
                     type="file" 
                     multiple 
                     accept="image/*,video/*"
                     className="hidden" 
                     id="media-upload" 
                     onChange={handleFileChange}
                   />
                   <label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                         <ImageIcon size={32}/>
                      </div>
                      <div className="text-sm font-bold text-indigo-950">Click to upload images/videos</div>
                      <div className="text-xs text-gray-400">MP4, PNG, JPG, WEBP (Max 50MB per file)</div>
                   </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mt-8">
                     {selectedFiles.map((file, i) => (
                       <div key={i} className="relative aspect-square rounded-2xl bg-gray-50 overflow-hidden group">
                          {file.type.startsWith('video/') ? <VideoIcon className="m-auto mt-4 text-primary" /> : <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />}
                          <button 
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <X size={20} />
                          </button>
                       </div>
                     ))}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-50 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-xs text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] bg-primary text-white h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                >
                  {isSubmitting ? 'Syncing Inventory...' : 'Confirm Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
