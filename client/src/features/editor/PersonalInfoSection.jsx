import { User } from 'lucide-react';
import useEditorStore from '@/store/editorStore';
import EditorSection from './EditorSection';

const FIELDS = [
  { key: 'fullName', label: 'Full Name', placeholder: 'John Doe', type: 'text', required: true },
  { key: 'jobTitle', label: 'Job Title', placeholder: 'Senior Software Engineer', type: 'text' },
  { key: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email', required: true },
  { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', type: 'tel' },
  { key: 'location', label: 'Location', placeholder: 'New York, NY', type: 'text' },
  { key: 'website', label: 'Website', placeholder: 'https://yoursite.com', type: 'url' },
  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/you', type: 'url' },
  { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/you', type: 'url' },
];

const PersonalInfoSection = () => {
  const { resumeData, updatePersonalInfo } = useEditorStore();
  const info = resumeData?.personalInfo || {};

  return (
    <EditorSection title="Personal Information" icon={User} defaultOpen={true}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FIELDS.map(({ key, label, placeholder, type, required }) => (
          <div key={key} className={key === 'fullName' || key === 'jobTitle' ? 'sm:col-span-2' : ''}>
            <label className="label">
              {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <input
              type={type}
              placeholder={placeholder}
              value={info[key] || ''}
              onChange={(e) => updatePersonalInfo(key, e.target.value)}
              className="input text-sm"
            />
          </div>
        ))}
      </div>
    </EditorSection>
  );
};

export default PersonalInfoSection;
