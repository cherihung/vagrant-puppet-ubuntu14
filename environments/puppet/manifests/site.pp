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
  # replace it so serving localhost in master works 
  file_line { 'someline':
    path  => '/etc/hosts',
    line  => '0.0.0.0 localhost.vm localhost',
    match => '^127\.0\.1\.1.*',
  }
}

class installNodejs {
  class { 'nodejs':
    repo_url_suffix => 'node_0.12',
    nodejs_package_ensure => '0.12.7-1nodesource1~trusty1',
    before => Package[$npm_packages],
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
