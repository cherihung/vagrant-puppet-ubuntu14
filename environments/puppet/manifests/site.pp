# inspired by sensible organization from https://gist.github.com/DanielChalk/2781470

### Puppet install stages ###
stage { 
  'users':      before => Stage['modules'];
  'modules':	before => Stage['packages'];
  'packages':   before => Stage['configure'];
  'configure':  before => Stage['services'];
  'services':   before => Stage['main'];
}

### STAGE service ###
class services {
  
}

### STAGE configure ###
class configure {
	Exec {
  		path => ['/usr/sbin', '/usr/bin', '/sbin', '/bin', '/usr/local/bin']
	}
	# 'node' is called 'nodejs' in Ubuntu. This symlinks 'node' to 'nodejs' for consistency
	file { '/usr/bin/node':
	  ensure => 'link',
	  target => "/usr/bin/nodejs"
	}	
}

class installNodejs {
  class { '::nodejs':
    manage_package_repo       => false,
    nodejs_dev_package_ensure => 'present',
    npm_package_ensure        => 'present'
  }
}

### STAGE modules: basic system modules for Puppet ### 
class modules {	
	include installNodejs
}

### STAGE packages: global packages ###
class packages {
  package {
  	"grunt-cli":
  		ensure => "present",
  		provider => "npm";
  	"gulp":
  	  	ensure => "present",
  		provider => "npm"; 
    "bower":
        ensure => "present",
      provider => "npm";
    "sass":
        ensure => "installed",
      provider => "gem";
  }
}

### STAGE users ###
class users
{
 
}

# link classes to stages
class { 
  users:      stage => "users";
  modules:	  stage => "modules";
  packages:   stage => "packages";
  configure:  stage => "configure";
  services:   stage => "services";
}
