import { AlignLeft } from 'lucide-react';
import useEditorStore from '@/store/editorStore';
import EditorSection from './EditorSection';

const SummarySection = () => {
  const { resumeData, updatePersonalInfo } = useEditorStore();
  const summary = resumeData?.personalInfo?.summary || '';

  return (
    <EditorSection title="Professional Summary" icon={AlignLeft}>
      <div>
        <label className="label">Summary</label>
        <textarea
          rows={5}
          placeholder="Write a compelling 3-4 sentence summary of your professional background, skills, and career goals..."
          value={summary}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          className="input text-sm resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">{summary.length} characters · Aim for 150-300</p>
      </div>
    </EditorSection>
  );
};

export default SummarySection;
