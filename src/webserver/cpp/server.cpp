#include <iostream>

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

typedef websocketpp::server<websocketpp::config::asio> server;

using websocketpp::connection_hdl;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;
using websocketpp::lib::ref;

void on_message(server &s, connection_hdl hdl, server::message_ptr msg) {


}

void on_authenticate(server &s, connection_hdl hdl, server::message_ptr msg) {
    std::cout << msg->get_payload() << std::endl;
    //
    // do authenticate
    //
    

    //
    // change message handler if we authed
    //
    server::connection_ptr con = s.get_conn_from_hdl(hdl);
    con->set_message_handler(bind(&on_message, ref(s), ::_1, ::_2));
        
}

int main() {
    server srv;

    srv.set_message_handler(bind(&on_authenticate, ref(s), ::1, ::2));

    srv.init_asio();
    srv.listen(8080);
    srv.start_accept();
   
    srv.run();
}
