export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const generateShareableLink = (type: 'achievement' | 'participation' | 'project', id: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/${type}s/${id}`;
};

export const generateShareText = (type: 'achievement' | 'participation' | 'project', data: any): string => {
  const baseText = `Check out my ${type}!`;
  
  switch (type) {
    case 'achievement':
      return `${baseText}\n\n🏆 ${data.title}\n📅 ${data.eventName}\n${data.description}\n\nView more: ${generateShareableLink(type, data.id)}`;
    case 'participation':
      return `${baseText}\n\n👥 ${data.title}\n📅 ${data.eventName}\n${data.description}\n\nView more: ${generateShareableLink(type, data.id)}`;
    case 'project':
      return `${baseText}\n\n💻 ${data.name}\n${data.description}\n${data.githubUrl ? `\nGitHub: ${data.githubUrl}` : ''}\n\nView more: ${generateShareableLink(type, data.id)}`;
    default:
      return baseText;
  }
};

export const shareViaNativeAPI = async (data: {
  title: string;
  text: string;
  url?: string;
}): Promise<boolean> => {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('Native sharing failed:', error);
      return false;
    }
  }
  return false;
};

export const shareItem = async (
  type: 'achievement' | 'participation' | 'project',
  data: any
): Promise<{ success: boolean; method: 'native' | 'clipboard' | 'failed' }> => {
  const shareText = generateShareText(type, data);
  const shareUrl = generateShareableLink(type, data.id);
  
  // Try native sharing first
  const nativeSuccess = await shareViaNativeAPI({
    title: `My ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    text: shareText,
    url: shareUrl
  });
  
  if (nativeSuccess) {
    return { success: true, method: 'native' };
  }
  
  // Fallback to clipboard
  const clipboardSuccess = await copyToClipboard(shareText);
  
  if (clipboardSuccess) {
    return { success: true, method: 'clipboard' };
  }
  
  return { success: false, method: 'failed' };
}; 