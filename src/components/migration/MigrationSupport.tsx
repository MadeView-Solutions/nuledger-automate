
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MigrationSupport = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Migration Support</CardTitle>
        <CardDescription>
          Resources to help you with your data migration process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="help" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="help">Help Center</TabsTrigger>
            <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="help">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SupportCard
                  title="Migration Guide"
                  description="Comprehensive step-by-step guide to data migration"
                  icon={<DocumentIcon className="h-6 w-6" />}
                />
                <SupportCard
                  title="FAQ"
                  description="Frequently asked questions about migration process"
                  icon={<QuestionIcon className="h-6 w-6" />}
                />
                <SupportCard
                  title="Troubleshooting Guide"
                  description="Solutions to common migration problems"
                  icon={<FixIcon className="h-6 w-6" />}
                />
                <SupportCard
                  title="Field Mapping Reference"
                  description="Detailed reference for mapping fields between systems"
                  icon={<ListIcon className="h-6 w-6" />}
                />
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Migration Knowledge Base</h3>
                <div className="space-y-2">
                  {helpArticles.map((article) => (
                    <div key={article.id} className="flex justify-between items-center p-2 hover:bg-background rounded-md transition-colors">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{article.title}</span>
                      </div>
                      <Button variant="ghost" size="sm">Read</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoTutorials.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="contact">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ContactMethodCard
                  title="Email Support"
                  description="Get assistance via email within 24 hours"
                  action="Send Email"
                  icon={<MailIcon className="h-6 w-6" />}
                />
                <ContactMethodCard
                  title="Live Chat"
                  description="Chat with a migration specialist in real-time"
                  action="Start Chat"
                  icon={<MessageIcon className="h-6 w-6" />}
                />
                <ContactMethodCard
                  title="Schedule Call"
                  description="Book a call with our migration team"
                  action="Schedule"
                  icon={<PhoneIcon className="h-6 w-6" />}
                />
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-4 flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                  Migration Support Hours
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Monday - Friday:</span>
                    <span className="ml-2">9:00 AM - 8:00 PM EST</span>
                  </div>
                  <div>
                    <span className="font-medium">Saturday:</span>
                    <span className="ml-2">10:00 AM - 6:00 PM EST</span>
                  </div>
                  <div>
                    <span className="font-medium">Sunday:</span>
                    <span className="ml-2">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface SupportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SupportCard: React.FC<SupportCardProps> = ({ title, description, icon }) => {
  return (
    <div className="border rounded-md p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          <Button variant="link" className="px-0 h-auto mt-2">View Guide</Button>
        </div>
      </div>
    </div>
  );
};

interface VideoCardProps {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, duration, thumbnail }) => {
  return (
    <div className="border rounded-md overflow-hidden hover:shadow-sm transition-shadow">
      <div className="relative aspect-video bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayIcon className="h-12 w-12 text-white opacity-80" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
          {duration}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium">{title}</h3>
        <Button variant="ghost" size="sm" className="mt-2">
          Watch Now
        </Button>
      </div>
    </div>
  );
};

interface ContactMethodCardProps {
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
}

const ContactMethodCard: React.FC<ContactMethodCardProps> = ({ 
  title, 
  description, 
  action,
  icon 
}) => {
  return (
    <div className="border rounded-md p-4 text-center">
      <div className="flex justify-center mb-3 text-primary">
        {icon}
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
      <Button size="sm">{action}</Button>
    </div>
  );
};

// Mock data
const helpArticles = [
  { id: 'a1', title: 'Preparing Your Data for Migration' },
  { id: 'a2', title: 'Handling Custom Fields During Migration' },
  { id: 'a3', title: 'Troubleshooting Data Validation Errors' },
  { id: 'a4', title: 'Post-Migration Data Verification Steps' },
  { id: 'a5', title: 'Managing Large Data Sets for Migration' },
];

const videoTutorials = [
  { 
    id: 'v1', 
    title: 'QuickBooks to NuLedger Migration Tutorial', 
    duration: '12:45',
    thumbnail: '/placeholder.svg' 
  },
  { 
    id: 'v2', 
    title: 'Using the Data Migration Wizard', 
    duration: '8:30',
    thumbnail: '/placeholder.svg' 
  },
  { 
    id: 'v3', 
    title: 'Custom Field Mapping Techniques', 
    duration: '15:20',
    thumbnail: '/placeholder.svg' 
  },
  { 
    id: 'v4', 
    title: 'Data Validation and Testing', 
    duration: '10:15',
    thumbnail: '/placeholder.svg' 
  },
];

// Icons
const DocumentIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const QuestionIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const FixIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const ListIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const DocumentTextIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="9" y1="10" x2="15" y2="10" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default MigrationSupport;
