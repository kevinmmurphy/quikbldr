#include <iostream>
#include "MsgProcessor.h"

#include "websocketpp/config/asio_no_tls.hpp"
#include "websocketpp/server.hpp"

typedef websocketpp::server<websocketpp::config::asio> server;

using websocketpp::connection_hdl;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;
using websocketpp::lib::ref;

void on_message(server &s, connection_hdl hdl, server::message_ptr msg) {
   std::cout << "Msg received: " << msg->get_payload() << std::endl;
   if (!MsgProcessor::Instance()->ProcessMessage(msg->get_payload()))
   {
	std::cout << "Failed to process message, closing connection." << std::endl;
   }

}


void on_authenticate(server &s, connection_hdl hdl, server::message_ptr msg) {
    std::cout << "Auth received: " <<  msg->get_payload() << std::endl;
    //
    // do authenticate
    //
    if ( MsgProcessor::Instance()->Authenticate(msg->get_payload()))
    {
      //
      // change message handler if we authed
      //
      std::cout << "Auth succeeded." << std::endl;
      server::connection_ptr con = s.get_con_from_hdl(hdl);
      con->set_message_handler(bind(on_message, ref(s), _1, _2));

    } 
    else{
       std::cout << "Auth failed. closing connection " << std::endl;
    }
}

void on_open(connection_hdl){
    std::cout << "Open: " << std::endl;
}

void on_close(connection_hdl hdl){
    std::cout << "Close: " << std::endl;
}


int main() {
    server srv;
 
    srv.set_open_handler(bind(on_open,  _1));
    srv.set_close_handler(bind(on_close, _1));
    srv.set_message_handler(bind(on_authenticate, ref(srv), _1, _2));

    srv.init_asio();
    srv.listen(8080);
    srv.start_accept();
   
    srv.run();
}
