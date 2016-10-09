#include "Game.h"
#include <stdio>
#include <string>

int main (void) {
    Game g;
    std::string name("Rita");
    int number(13777);
    Bool b(true);

    
    
    g.SetStingField(name);
    g.SetNumberFiled(number);
    g.SetBoolField(b);  

    std::string out = g.Serialize();

    std::cout << out;
    std::cout << "\n";


}
