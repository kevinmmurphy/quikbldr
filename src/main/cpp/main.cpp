#include "Objects.h"
#include <iostream>
#include <string>

int main (void) {
    Game g,g2;
    std::string name("Rita");
    int number(13777);
    Bool b(true);

	std::cout << "Testing default values\n";
	std::cout << "Testing string\n";
	std::string testStr = g.GetStringField();
	if (testStr.compare("UNASSIGNED") != 0)
	{
		std::cout << "String test failed!\n";
		return 1;
	}
	
	std::cout << "Testing number\n";
	int testNumber = g.GetNumberField();
	if (testNumber != 10)
	{
		std::cout << "Number test failed!\n";
		return 1;
	}
	
	std::cout << "Testing bool\n";
	Bool testb = g.GetBoolField();
	if (!testb)
	{
		std::cout << "Bool test failed!\n";
		return 1;
	}
	
    g.SetID("test");
    g.SetStringField(name);
    g.SetNumberField(number);
    g.SetBoolField(b);  
	
	testStr = g.GetStringField();
	std::cout << "Testing getters and setters\n";
	std::cout << "Testing string\n";
	if (testStr.compare(name)!= 0)
	{
		std::cout << "String test failed!\n";
		return 1;
	}
	
	testNumber = g.GetNumberField();
	std::cout << "Testing number\n";
	if (testNumber != number)
	{
		std::cout << "Number test failed!\n";
		return 1;
	}

	bool testBool = g.GetBoolField();
	std::cout << "Testing bool\n";
	if (testBool != b)
	{
		std::cout << "Bool test failed!\n";
		return 1;
	}
	
    std::cout << "Testing Serialization\n";
    std::string out = g.Serialize();
    g2.Deserialize(out);
    std::string out2 = g2.Serialize();
	if (out.compare(out2) != 0)
	{
		std::cout << "Bool test failed!\n";
		return 1;	
	}
    std::cout << "Success\n";
}
