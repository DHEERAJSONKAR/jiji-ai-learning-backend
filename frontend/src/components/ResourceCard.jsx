import { FileText, Video, Link as LinkIcon, BookOpen } from 'lucide-react';

const ResourceCard = ({ resource }) => {
  const icons = {
    pdf: FileText,
    video: Video,
    link: LinkIcon,
    article: BookOpen
  };

  const Icon = icons[resource.type] || FileText;

  const colors = {
    pdf: 'from-red-500 to-orange-500',
    video: 'from-purple-500 to-pink-500',
    link: 'from-blue-500 to-cyan-500',
    article: 'from-green-500 to-emerald-500'
  };

  return (
    <a
      href={resource.file_url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
    >
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors[resource.type] || colors.link} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="text-white w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate">{resource.title}</h4>
        <p className="text-gray-400 text-sm capitalize">{resource.type} • {resource.topic}</p>
      </div>
    </a>
  );
};

export default ResourceCard;
