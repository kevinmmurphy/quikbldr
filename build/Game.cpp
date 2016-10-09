
#include "Game.h"

Game::Game() 
std::string Game::Serialize(void){
    std::string out;
    out += "{ ";
    out += "StringField : \"" + m_StringField + "\",";
    out += "NumberField : "" + m_NumberField + "",";
    out += "BoolField : "" + m_BoolField + "",";
    out += "}";
    return out;
}
void Game::Deserialize(std::string &in)){
    json jin(in);
    m_StringField = jin[StringField].toString();
    m_NumberField = jin[NumberField].toNumber();
    m_BoolField = jin[BoolField].toBool();
}
