import React from 'react';
import {
  Mail,
  CornerUpRight,
  GitBranch,
  MessageSquareText,
  Inbox,
  Send,
  ShieldAlert,
  KeyRound,
  FolderTree,
  Image as ImageIcon,
  FolderLock,
  PieChart,
  Server,
  DownloadCloud,
  GitFork,
  Database,
  Layers,
  Wand2,
  Globe2,
  Network,
  Globe,
  Share2,
  Copy,
  ArrowRightLeft,
  Users,
  AlertTriangle,
  Activity,
  FileText,
  Gauge,
  ShieldCheck,
  Terminal,
  Ban,
  Link2Off,
  Smartphone,
  Box,
  Cpu,
  FileCode,
  Zap,
  TerminalSquare,
  Clock,
  Crosshair,
  FileQuestion,
  Lock,
  Languages,
  Palette,
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface IconHelperProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, className = 'w-5 h-5', size }) => {
  const iconProps = { className, size };

  switch (name) {
    case 'Mail': return <Mail {...iconProps} />;
    case 'CornerUpRight': return <CornerUpRight {...iconProps} />;
    case 'GitBranch': return <GitBranch {...iconProps} />;
    case 'MessageSquareText': return <MessageSquareText {...iconProps} />;
    case 'Inbox': return <Inbox {...iconProps} />;
    case 'Send': return <Send {...iconProps} />;
    case 'ShieldAlert': return <ShieldAlert {...iconProps} />;
    case 'KeyRound': return <KeyRound {...iconProps} />;
    case 'FolderTree': return <FolderTree {...iconProps} />;
    case 'Image': return <ImageIcon {...iconProps} />;
    case 'FolderLock': return <FolderLock {...iconProps} />;
    case 'PieChart': return <PieChart {...iconProps} />;
    case 'Server': return <Server {...iconProps} />;
    case 'DownloadCloud': return <DownloadCloud {...iconProps} />;
    case 'GitFork': return <GitFork {...iconProps} />;
    case 'Database': return <Database {...iconProps} />;
    case 'Layers': return <Layers {...iconProps} />;
    case 'Wand2': return <Wand2 {...iconProps} />;
    case 'Globe2': return <Globe2 {...iconProps} />;
    case 'Network': return <Network {...iconProps} />;
    case 'Globe': return <Globe {...iconProps} />;
    case 'Share2': return <Share2 {...iconProps} />;
    case 'Copy': return <Copy {...iconProps} />;
    case 'ArrowRightLeft': return <ArrowRightLeft {...iconProps} />;
    case 'Users': return <Users {...iconProps} />;
    case 'AlertTriangle': return <AlertTriangle {...iconProps} />;
    case 'Activity': return <Activity {...iconProps} />;
    case 'FileText': return <FileText {...iconProps} />;
    case 'Gauge': return <Gauge {...iconProps} />;
    case 'ShieldCheck': return <ShieldCheck {...iconProps} />;
    case 'Terminal': return <Terminal {...iconProps} />;
    case 'Ban': return <Ban {...iconProps} />;
    case 'Link2Off': return <Link2Off {...iconProps} />;
    case 'Smartphone': return <Smartphone {...iconProps} />;
    case 'Box': return <Box {...iconProps} />;
    case 'Cpu': return <Cpu {...iconProps} />;
    case 'FileCode': return <FileCode {...iconProps} />;
    case 'Zap': return <Zap {...iconProps} />;
    case 'TerminalSquare': return <TerminalSquare {...iconProps} />;
    case 'Clock': return <Clock {...iconProps} />;
    case 'Crosshair': return <Crosshair {...iconProps} />;
    case 'FileQuestion': return <FileQuestion {...iconProps} />;
    case 'Lock': return <Lock {...iconProps} />;
    case 'Languages': return <Languages {...iconProps} />;
    case 'Palette': return <Palette {...iconProps} />;
    case 'UserCheck': return <UserCheck {...iconProps} />;
    case 'Search': return <Search {...iconProps} />;
    case 'CheckCircle2': return <CheckCircle2 {...iconProps} />;
    case 'XCircle': return <XCircle {...iconProps} />;
    default: return <HelpCircle {...iconProps} />;
  }
};
