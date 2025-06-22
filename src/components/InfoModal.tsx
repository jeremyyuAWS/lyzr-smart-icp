import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { HelpCircle } from 'lucide-react';

interface InfoModalProps {
  trigger?: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  businessValue: string;
}

export function InfoModal({ trigger, title, description, features, businessValue }: InfoModalProps) {
  return (
    <Dialog>
      {trigger || (
        <button className="inline-flex items-center justify-center p-1 rounded-full hover:bg-slate-100 transition-colors">
          <HelpCircle className="h-4 w-4 text-slate-400" />
        </button>
      )}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-base text-slate-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Key Features</h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Business Value</h4>
            <p className="text-slate-700 leading-relaxed">{businessValue}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}