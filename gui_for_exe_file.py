import easygui
import os, sys
import subprocess
import time
import requests
from tkinter import *

class MyWindow:
    def __init__(self, win):
        self.lbl1=Label(win, text="Welcome to the DMBON Assistant Installer", bg="black", fg="white")
        self.lbl2=Label(win, text="Press continue to continue", bg="black", fg="white")
        self.lbl1.place(x=10, y=10)
        self.lbl2.place(x=10, y=30)
        self.installation_text=Label(window, text="", bg="black", fg="white")
        self.installation_text.place(x=10, y=80)
        self.btn1 = Button(win, text='Add')
        self.current_y = 80
        self.b1=Button(win, text='Continue', command=lambda : self.installation())
        self.b1.place(x=10, y=50)
        
    def errorhandling(self,step,error):
        self.error_text = Label(window, text=f"- An error occured in step {step}: {error} \n Closing program in 15s.", bg="red", fg="white")
        self.error_text.place(x=10, y=180)
        self.error_text.update()
        time.sleep(15)
        exit()
        
    def check_os(self):
        ose = "unknown"
        if os.name == "nt":
            ose = "Windows"
        if os.name == "posix":
            ose = "Linux"
        if os.name == "mac":
            ose = "Mac"
        return ose

    def installation(self):
        #delete the button 
        self.b1.destroy()
        self.os_detected = self.check_os()
        self.installation_text.configure(text="- Checking DMBON Assistant requirements")
        self.installation_text.update()
        self.npm_line = Label(window, text="- npm status: checking", bg="black", fg="white")
        self.python_line = Label(window, text="- Python status: checking", bg="black", fg="white")
        self.git_line = Label(window, text="- Git status: checking", bg="black", fg="white")
        self.npm_line.place(x=10, y=100)
        self.python_line.place(x=10, y=120)
        self.git_line.place(x=10, y=140)
        self.npm_line.update()
        self.python_line.update()
        self.git_line.update()
        self.npm_check_install()
        self.python_check_install()
        self.git_check_install()
        #self.check_all_installed()
        
    def check_all_installed(self):
        try:
            while True:
                if os.system("npm -v") == 0 and os.system("python -V") == 0 and os.system("git --version") == 0:
                    self.installation_text.configure(text="- All requirements are installed, starting up DMBON Assistant")
                    self.installation_text.update()
                    #run the sh start_webtop_application.sh file in a new terminal 
                    filepathto = os.path.join(os.path.dirname(os.path.realpath(__file__)),"dmbon-assistant.sh")
                    print(filepathto)
                    #execute command in git bash terminal
                    os.system('start_webtop_application.sh')
                    #os.system('start \"\" \"C:\Program Files\Git\git-bash.exe\" /k "cd '+os.path.dirname(os.path.realpath(__file__))+' && '+filepathto+' start"')
                    #still need to find a way to run the sh file in a new terminal
                    self.end_installation()
        except Exception as e:
            self.errorhandling("test_all_installed",e)       
        
    def end_installation(self):
        try:
            self.end_install_text = Label(window, text="- Installation complete, exiting in 3s.", bg="black", fg="white")
            self.current_y += 20
            self.end_install_text.place(x=10, y=160)
            installing = True
            while installing:
                #check if end of text has 3 .s if yes then delete them and add 1
                # if no then add 1
                text =  self.end_install_text.cget(key="text")
                if text[-3:] == "...":
                    text = text[:-3]
                else:
                    text += "."
                self.end_install_text.configure(text=text)
                self.end_install_text.update()
                time.sleep(3)
                exit()
        except Exception as e:
            self.errorhandling("end_installation",e)
            
    def python_check_install(self):
        installed = ""
        try:
            if os.system("python -V") == 0:
                installed = "- Python status: installed"
                self.python_line.configure(text=installed)
                self.python_line.update()
            else:
                installed = "- Python status: not installed, installing now"
                self.python_line.configure(text=installed)
                self.python_line.update()
                self.python_install()
        except Exception as e:
            self.python_line.configure(text="- An Exception occured : {e}")
            self.python_line.update()
            self.errorhandling("python_check_install",e)
            
    def git_check_install(self):
        installed = ""
        try:
            if os.system("git --version") == 0:
                installed = "- Git status: installed"
                self.git_line.configure(text=installed)
                self.git_line.update()
            else:
                installed = "- Git status: not installed, installing now"
                self.git_line.configure(text=installed)
                self.git_line.update()
                self.git_install()
        except Exception as e:
            self.git_line.configure(text="- An Exception occured : {e}")
            self.git_line.update()
            self.errorhandling("git_check_all",e)
        
    def git_install(self):
        ose = self.check_os()
        if ose == "Linux":
            url = "https://www.kernel.org/pub/software/scm/git/git-2.39.1.tar.gz"
            command = f"curl -O {url}"
            os.system(command)
            os.system("tar -xzf git-2.39.1.tar.gz")
        if ose == "Mac":
            url = "https://sourceforge.net/projects/git-osx-installer/files/latest/download"
            os.system("curl -O {url}")
            os.system("git-2.39.1-intel-universal-mavericks.dmg")
        if ose == "windows":
            url = "https://github.com/git-for-windows/git/releases/download/v2.39.1.windows.1/Git-2.39.1-64-bit.exe"
            os.system("curl -O {url}")
            os.system("Git-2.39.1-64-bit.exe")
        
        while not os.system("git --version") == 0:
            time.sleep(3)
            self.git_line.configure(text="- Git status: installing")
            self.git_line.update()
        self.git_line.configure(text="- Git status: installed")
        self.git_line.update()
    
    def python_install(self):
        ose = self.check_os()
        if ose == "Windows":
            url = "https://www.python.org/ftp/python/3.11.1/python-3.11.1-amd64.exe"
            command = f"curl -O {url}"
            os.system(command)
            os.system("python-3.11.1-amd64.exe")
        if ose == "Linux": #for each version a manual check needs to be done to see if it works
            url = "https://www.python.org/ftp/python/3.11.1/Python-3.11.1.tgz"
            command = f"curl -O {url}"
            os.system(command)
            os.system("tar -xvf Python-3.11.1.tgz")
        if ose == "Mac":
            url = "https://www.python.org/ftp/python/3.11.1/python-3.11.1-macos11.pkg"
            command = f"curl -O {url}"
            os.system(command)
            os.system("python-3.11.1-macos11.pkg")
        
        while not os.system("python -V") == 0:
            time.sleep(3)
            self.python_line.configure(text="- Python status: installing")
            self.python_line.update()
        self.python_line.configure(text="- Python status: installed")
        self.python_line.update()
        
    def npm_check_install(self):
        installed = ""
        try:
            if os.system("npm -v") == 0:
                installed = "- npm status: installed"
                self.npm_line.configure(text=installed)
                self.npm_line.update()
            else:
                installed = "- npm status: not installed, installing now"
                self.npm_line.configure(text=installed)
                self.npm_line.update()
                self.npm_install()
        except Exception as e:
            self.npm_line.configure(text="- An Exception occured : {e}")
            self.npm_line.update()
            self.errorhandling("npm_check_all",e)
        
    def npm_install(self):
        #install npm
        #first check what os is installed 
        ose = self.check_os()
        if ose == "Windows":
            #install npm
            url = "https://nodejs.org/dist/v18.13.0/node-v18.13.0-x64.msi"
        if ose == "Linux":
            #install npm
            url = "https://nodejs.org/dist/v18.13.0/node-v18.13.0-linux-x64.tar.xz"
        if ose == "Mac":
            url = "https://nodejs.org/dist/v18.13.0/node-v18.13.0-darwin-x64.tar.xz"
        
        #execute the download
        command = "curl -o nodejs.msi " + url
        os.system(command)
        #install nodejs
        os.system("msiexec /i nodejs.msi /norestart")
        #while npm is not installed keep checking
        while not os.system("npm -v") == 0:
                installed = "- npm status: installing now"
                self.npm_line.configure(text=installed)
                self.npm_line.update()
                time.sleep(3)
        self.npm_line.configure(text="- npm status: installed")
        self.npm_line.update() 
        
window=Tk()
mywin=MyWindow(window)
#add minimize button
window.protocol("WM_DELETE_WINDOW", window.iconify)
window.geometry("500x500")
window.configure(background="black")
window.resizable(False, False)
window.wm_attributes("-topmost", 1)
window.attributes("-alpha", 0.9)
window.attributes("-toolwindow", 1)
window.title("DMBON Assistant Launcher")
window.mainloop()
