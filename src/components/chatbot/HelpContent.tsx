
import React from "react";
import { Button } from "@/components/ui/button";
import { helpCategories } from "./types";
import { FileText, BookText, HelpCircle } from "lucide-react";

interface HelpContentProps {
  onSelectQuestion: (question: string) => void;
}

const HelpContent: React.FC<HelpContentProps> = ({ onSelectQuestion }) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "FileText":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "BookText":
        return <BookText className="h-5 w-5 text-green-500" />;
      case "HelpCircle":
        return <HelpCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <HelpCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 py-2">
      <p className="text-sm text-muted-foreground">
        Here are some questions you can ask me:
      </p>
      {helpCategories.map((category) => (
        <div key={category.name} className="space-y-2">
          <div className="flex items-center gap-2">
            {getIconComponent(category.icon)}
            <h3 className="font-medium">{category.name} Questions</h3>
          </div>
          <ul className="space-y-2 ml-7">
            {category.questions.map((question) => (
              <li key={question}>
                <Button
                  variant="link"
                  className="p-0 h-auto text-muted-foreground hover:text-primary justify-start"
                  onClick={() => onSelectQuestion(question)}
                >
                  {question}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default HelpContent;
