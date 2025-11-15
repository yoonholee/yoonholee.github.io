require 'html-proofer'

desc 'Build the site'
task :build do
  sh 'bundle exec jekyll build'
end

desc 'Test HTML with HTMLProofer (internal links only)'
task test: :build do
  options = {
    assume_extension: true,
    disable_external: true,  # Fast local testing
    allow_hash_href: true,
    check_html: true,
  }
  HTMLProofer.check_directory('./_site', options).run
end

desc 'Test HTML including external links (slow)'
task test_external: :build do
  options = {
    assume_extension: true,
    disable_external: false,  # Check external links
    allow_hash_href: true,
    check_html: true,
    ignore_urls: [
      /linkedin\.com/,
      /twitter\.com/,
      /x\.com/,
    ],
    typhoeus: {
      timeout: 30,
      connecttimeout: 10,
    }
  }
  HTMLProofer.check_directory('./_site', options).run
end

task default: :test
