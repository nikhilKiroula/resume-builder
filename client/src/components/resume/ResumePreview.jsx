import ModernTemplate from '@/templates/ModernTemplate';
import ClassicTemplate from '@/templates/ClassicTemplate';
import MinimalTemplate from '@/templates/MinimalTemplate';
import ProfessionalTemplate from '@/templates/ProfessionalTemplate';
import CreativeTemplate from '@/templates/CreativeTemplate';
import ATSTemplate from '@/templates/ATSTemplate';

const templateMap = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  ats: ATSTemplate,
};

/**
 * Renders the correct template component based on resume.selectedTemplate.
 * Used in both the editor preview panel and the public resume view.
 */
const ResumePreview = ({ resume }) => {
  const Template = templateMap[resume?.selectedTemplate] || ModernTemplate;
  return <Template resume={resume} />;
};

export default ResumePreview;
