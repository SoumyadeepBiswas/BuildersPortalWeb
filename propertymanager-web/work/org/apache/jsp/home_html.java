/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.69
 * Generated at: 2017-06-08 11:31:59 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class home_html extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final javax.servlet.jsp.JspFactory _jspxFactory =
          javax.servlet.jsp.JspFactory.getDefaultFactory();

  private static java.util.Map<java.lang.String,java.lang.Long> _jspx_dependants;

  private volatile javax.el.ExpressionFactory _el_expressionfactory;
  private volatile org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public java.util.Map<java.lang.String,java.lang.Long> getDependants() {
    return _jspx_dependants;
  }

  public javax.el.ExpressionFactory _jsp_getExpressionFactory() {
    if (_el_expressionfactory == null) {
      synchronized (this) {
        if (_el_expressionfactory == null) {
          _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
        }
      }
    }
    return _el_expressionfactory;
  }

  public org.apache.tomcat.InstanceManager _jsp_getInstanceManager() {
    if (_jsp_instancemanager == null) {
      synchronized (this) {
        if (_jsp_instancemanager == null) {
          _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
        }
      }
    }
    return _jsp_instancemanager;
  }

  public void _jspInit() {
  }

  public void _jspDestroy() {
  }

  public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
        throws java.io.IOException, javax.servlet.ServletException {

    final javax.servlet.jsp.PageContext pageContext;
    javax.servlet.http.HttpSession session = null;
    final javax.servlet.ServletContext application;
    final javax.servlet.ServletConfig config;
    javax.servlet.jsp.JspWriter out = null;
    final java.lang.Object page = this;
    javax.servlet.jsp.JspWriter _jspx_out = null;
    javax.servlet.jsp.PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("<!DOCTYPE html>\r\n");
      out.write("\r\n");
      out.write("<html xmlns=\"http://www.w3.org/1999/xhtml\" ng-app=\"app\" ng-controller=\"AppCtrl\">\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<head>\r\n");
      out.write("<meta charset=\"utf-8\" />\r\n");
      out.write("<title page-title>LondonHydro</title>\r\n");
      out.write("<script type=\"text/javascript\">\r\n");
      out.write("\tvar System= {\r\n");
      out.write("\t\tTHEME : \"classic\",\r\n");
      out.write("\t\tdevelopmentMode:false,\r\n");
      out.write("\t\tisModal:false\r\n");
      out.write("\t}\r\n");
      out.write("</script>\r\n");
      out.write("<meta name=\"description\" content=\"blank page\" />\r\n");
      out.write("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n");
      out.write("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\r\n");
      out.write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<link rel=\"shortcut icon\" href=\"img/favicon.ico\" type=\"image/x-icon\">\r\n");
      out.write("\r\n");
      out.write("<!--Basic Styles-->\r\n");
      out.write("<link href=\"//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css\" rel=\"stylesheet\" />\r\n");
      out.write("\r\n");
      out.write("<link ng-if=\"settings.rtl\"\r\n");
      out.write("\tng-href=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/assets/css/bootstrap-rtl.min.css\"\r\n");
      out.write("\trel=\"stylesheet\" />\r\n");
      out.write("<link href=\"https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css\" rel=\"stylesheet\"\r\n");
      out.write("\tintegrity=\"sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1\" crossorigin=\"anonymous\">\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<!--Fonts-->\r\n");
      out.write("<link href=\"//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,400,600,700,300\"\r\n");
      out.write("\trel=\"stylesheet\" type=\"text/css\">\r\n");
      out.write("\r\n");
      out.write("<!--Beyond styles-->\r\n");
      out.write("<link href=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/assets/css/beyond.min.css\" rel=\"stylesheet\" />\r\n");
      out.write("<link href=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/assets/css/skins/darkred.css\" rel=\"stylesheet\" />\r\n");
      out.write("<link href=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/assets/css/demo.min.css\" rel=\"stylesheet\" />\r\n");
      out.write("<link href=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/assets/css/typicons.min.css\" rel=\"stylesheet\" />\r\n");
      out.write("<link href=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/assets/css/animate.min.css\" rel=\"stylesheet\" />\r\n");
      out.write("<link ng-href=\"{{settings.skin}}\" rel=\"stylesheet\" type=\"text/css\" />\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<!-- LondonHydro Styles  -->\r\n");
      out.write("<link href=\"uxp/css/branding/uxp-branding.css\" rel=\"stylesheet\" />\r\n");
      out.write("<link href=\"uxp/css/core/uxp-core.css\" rel=\"stylesheet\" />\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<!-- core Scripts -->\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js\"></script>\r\n");
      out.write("<!-- core Scripts -->\r\n");
      out.write("\r\n");
      out.write("<!-- Angular -->\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular.min.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular-route.min.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.1/angular-ui-router.min.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular-animate.min.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular-cookies.min.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular-resource.min.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular-sanitize.min.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular-touch.min.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular-messages.min.js\"></script>\r\n");
      out.write("<!-- Angular -->\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<!-- others: angular module -->\r\n");
      out.write("<script src=\"//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.4.0/ui-bootstrap-tpls.min.js\"></script>\r\n");
      out.write("<script src=\"//cdnjs.cloudflare.com/ajax/libs/oclazyload/1.0.9/ocLazyLoad.min.js\"></script>\r\n");
      out.write("<script src=\"//cdnjs.cloudflare.com/ajax/libs/checklist-model/0.11.0/checklist-model.min.js\"></script>\r\n");
      out.write("<!-- others: angular module -->\r\n");
      out.write("\r\n");
      out.write("<!-- others: non angular module -->\r\n");
      out.write("<script src=\"//cdnjs.cloudflare.com/ajax/libs/ngStorage/0.3.11/ngStorage.min.js\"></script>\r\n");
      out.write("<script src=\"//cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js\"></script>\r\n");
      out.write("<script src=\"//cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js\"></script>\r\n");
      out.write("<!-- others: non angular module -->\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<!-- beyond admin - part1 -->\r\n");
      out.write("<script src=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/utilities.js\"></script>\r\n");
      out.write("<script\r\n");
      out.write("\tsrc=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/angular/angular-ui-utils/angular-ui-utils.js\"></script>\r\n");
      out.write("<script\r\n");
      out.write("\tsrc=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/lib/angular/angular-breadcrumb/angular-breadcrumb.js\"></script>\r\n");
      out.write("<!-- beyond admin - part1 -->\r\n");
      out.write("\r\n");
      out.write("<!--  application js -->\r\n");
      out.write("<script src=\"app/js/environment.js\"></script>\r\n");
      out.write("<script src=\"released/js/uxp.min.js\"></script>\r\n");
      out.write("<script src=\"released/js/backend.min.js\"></script>\r\n");
      out.write("<script src=\"released/js/pmp-config.min.js\"></script>\r\n");
      out.write("<script src=\"released/js/pmp.min.js\"></script>\r\n");
      out.write("<!--  application js -->\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<!-- beyond admin - part2 with app module dependency-->\r\n");
      out.write("<script src=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/app/directives/loading.js\"></script>\r\n");
      out.write("<script src=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/app/directives/skin.js\"></script>\r\n");
      out.write("<script src=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/app/directives/sidebar.js\"></script>\r\n");
      out.write("<script src=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/app/directives/header.js\"></script>\r\n");
      out.write("<script src=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/app/directives/navbar.js\"></script>\r\n");
      out.write("<script src=\"//storage.googleapis.com/londonhydro-static/BeyondAdmin/1.6.0/app/directives/widget.js\"></script>\r\n");
      out.write("<!-- beyond admin - part2 with app module dependency-->\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\t<div id=\"appInitLoader\" class=\"loader-bg\" data-ng-if=\"ApplConfig.appInitialize !=true\">\r\n");
      out.write("\t\t<div class=\"loader-img\" style=\"display: block;\"></div>\r\n");
      out.write("\t</div>\r\n");
      out.write("\t<div ui-view autoscroll=\"false\"></div>\r\n");
      out.write("</body>\r\n");
      out.write("</html>\r\n");
    } catch (java.lang.Throwable t) {
      if (!(t instanceof javax.servlet.jsp.SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try {
            if (response.isCommitted()) {
              out.flush();
            } else {
              out.clearBuffer();
            }
          } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
