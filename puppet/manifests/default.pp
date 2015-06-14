
# Lets tell Puppet the order of our stages
stage { 
  'users':      before => Stage['modules'];
  'modules':	before => Stage['packages'];
  'packages':   before => Stage['configure'];
  'configure':  before => Stage['services'];
  'services':   before => Stage['main'];
}

class services {
  #we want apache and mongo to be running when the server boots
  # service { 
  #   'mongodb':
  #     ensure => running,
  #     enable => true;
  # }
}

class configure {
	Exec {
  		path => ['/usr/sbin', '/usr/bin', '/sbin', '/bin', '/usr/local/bin']
	}
	# Because of a package name collision, 'node' is called 'nodejs' in Ubuntu.
	# Here we're adding a symlink so 'node' points to 'nodejs'
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
#basic system modules for Puppet
class modules {	
	include apt
	include stdlib
	include installNodejs
}

#global packages
class packages {
  package {
  	"grunt-cli":
  		ensure => "present",
  		provider => "npm",
  		require => Package['nodejs'];
  	"gulp":
  	  	ensure => "present",
  		provider => "npm";
  }
}

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