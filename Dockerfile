FROM	centos:centos6
RUN		rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
RUN     yum install -y npm
COPY	. /nutshell
RUN		cd /nutshell; npm install
EXPOSE 	8080
CMD		["node", "/nutshell/server.js"]


LUNCH TIME DEMO :)
1) list prominent applications - don't be TOO thorough; brevity begs.
2) identify one or two applications with high volume throughput or frequent usage.
3) AGREE on enterprise service name. be abstract but specific. 

case study:
northam platinum
health & safety
procurement
financials

this is the capability of

and it can always be renamed with minimal impact! (an idea is to create a new type property for services. so when you rename enterprise services, an "alias" type ser )




