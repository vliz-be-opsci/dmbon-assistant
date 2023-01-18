import easygui
import os
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
        self.os_detected = self.check_os()
        self.installation_text.configure(text="- Checking DMBON Assistant requirements")
        self.installation_text.update()
        self.npm_check_install()
        
    def end_installation(self):
        self.end_install_text = Label(window, text="- Installation complete", bg="black", fg="white")
        self.current_y += 20
        self.end_install_text.place(x=10, y=self.current_y)
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
        
    def npm_check_install(self):
        installed = ""
        if os.system("npm -v") == 0:
            installed = "- npm is installed"
        else:
            installed = "- npm is not installed, installing now"
        self.npm_install_text = Label(window, text=installed, bg="black", fg="white")
        self.current_y += 20
        self.npm_install_text.place(x=10, y=self.current_y)
        self.npm_install_text.update()
        
        self.end_installation()
        
    def npm_install(self):
        #install npm
        #first check what os is installed 
        os = self.check_os()
        if os == "Windows":
            #install npm
            url = "https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi"
        if os == "Linux":
            #install npm
            url = "https://nodejs.org/dist/v14.17.0/node-v14.17.0-linux-x64.tar.xz"
        if os == "Mac":
            url = "https://nodejs.org/dist/v14.17.0/node-v14.17.0-darwin-x64.tar.xz"
        
        #execute the download
        os.system("curl -o nodejs.msi " + url)
        #install nodejs
        os.system("msiexec /i nodejs.msi /quiet /norestart")
        self.npm_install_text.configure(text="- npm installed")
        self.npm_install_text.update()
        self.end_installation()    
        
   

window=Tk()
mywin=MyWindow(window)
window.geometry("500x500")
window.configure(background="black")
window.resizable(False, False)
window.wm_attributes("-topmost", 1)
window.attributes("-alpha", 0.9)
window.attributes("-toolwindow", 1)
window.title("DMBON Assistant Launcher")
window.mainloop()
