#include <iostream>
#include <string>
#include <fstream>
#include <sstream>

using namespace std;

class myString {
    private:
        string m_str;
    public:
        myString(string s) {
            m_str = s;
        }
};

class ReadClass {
    private:
        int m_classCount = 0;
        string classNames[2^5];
    public:
        ReadClass() {}
        void showClass() {
            ifstream in;
            string line;
            in.open("main.cpp");

            while (getline(in, line)) {
                if (line.find("class") == 0){
                    classNames[m_classCount++] = line;
                }
            }
            in.close();
            
            if (m_classCount) {
                cout << m_classCount << " class" << " in main.cpp" << endl;
                for (int i=0; i<m_classCount; i++) {
                    stringstream str(classNames[i]);
                    for (int j=0; j<m_classCount; j++) {
                        getline(str, line, ' ');
                        cout << line << " ";
                    }
                    cout << endl;
                }
            }
        }
};

int main() {
    ReadClass rfile;
    rfile.showClass();
    return 0;
}
