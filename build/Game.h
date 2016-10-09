#include "ISerializable.h"
#include "Object.h"


class Game: public Object, public ISerializable{
    public:
        Game();

        void  SetStringField(const String &arg){ m_StringField = arg; }
        String GetStringField(void){ return m_StringField;}

        void  SetNumberField(const Number &arg){ m_NumberField = arg; }
        Number GetNumberField(void){ return m_NumberField;}

        void  SetBoolField(const Bool &arg){ m_BoolField = arg; }
        Bool GetBoolField(void){ return m_BoolField;}


        std::string Serialize(void);
        void Deserialize(std::string &json);

    private:
        String m_StringField;
        Number m_NumberField;
        Bool m_BoolField;
};
