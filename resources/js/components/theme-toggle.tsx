import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useSidebar } from '@/components/ui/sidebar';

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    useEffect(() => {
        // Check initial theme
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <Button
            variant="ghost"
            onClick={toggleTheme}
            className={`h-10 ${isCollapsed ? 'w-10 px-0' : 'w-full justify-start mx-2'}`}
        >
            {theme === 'light' ? (
                <>
                    <Moon className="h-5 w-5" />
                    {!isCollapsed && <span className="ml-2">Dark Mode</span>}
                </>
            ) : (
                <>
                    <Sun className="h-5 w-5" />
                    {!isCollapsed && <span className="ml-2">Light Mode</span>}
                </>
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
