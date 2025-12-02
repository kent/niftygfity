# Silence Devise routing deprecation warnings for Rails 8.1+
# This is a temporary fix until Devise releases an update
# See: https://github.com/heartcombo/devise/issues/5705

if Rails.version >= "8.1"
  module DeviseRails81Compat
    def resource(*args, **options, &block)
      # Convert positional hash args to keyword args for Rails 8.1 compatibility
      if args.last.is_a?(Hash)
        options = args.pop.merge(options)
      end
      super(*args, **options, &block)
    end
  end

  ActionDispatch::Routing::Mapper.prepend(DeviseRails81Compat)
end
