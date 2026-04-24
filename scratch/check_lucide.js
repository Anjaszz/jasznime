const lucide = require('lucide-react');
console.log(Object.keys(lucide).filter(k => 
  k.includes('Message') || 
  k.includes('Send') || 
  k.includes('Globe') || 
  k.includes('Share') || 
  k.includes('Code') || 
  k.includes('Cpu')
));
