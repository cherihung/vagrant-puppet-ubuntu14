Exec {
  path => ['/usr/sbin', '/usr/bin', '/sbin', '/bin', '/usr/local/bin']
}

class { '::nodejs':
  manage_package_repo       => false,
  nodejs_dev_package_ensure => 'present',
  npm_package_ensure        => 'present',
}

# --- NodeJS --- #

# Because of a package name collision, 'node' is called 'nodejs' in Ubuntu.
# Here we're adding a symlink so 'node' points to 'nodejs'
file { '/usr/bin/node':
  ensure => 'link',
  target => "/usr/bin/nodejs"
}


# --- MongoDB --- #
#class { '::mongodb::server': }
include apt
include stdlib
include nodejs