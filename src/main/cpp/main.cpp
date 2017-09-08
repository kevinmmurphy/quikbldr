#include "Objects.h"
#include <iostream>
#include <string>

int main (void) {
    Game g,g2;
    std::string name("Rita");
    int number(13777);
    Bool b(true);

    
    g.SetID("test");
    g.SetStringField(name);
    g.SetNumberField(number);
    g.SetBoolField(b);  

    std::cout << "Serializing...\n";
    std::string out = g.Serialize();
    std::cout << out << "\n";;
    std::cout << "Deserializing...\n";
    g2.Deserialize(out);
    std::cout << "Done Deserialize\n";
    std::string out2 = g2.Serialize();

    std::cout << out2 << "\n";
    std::cout << "\n";


}
