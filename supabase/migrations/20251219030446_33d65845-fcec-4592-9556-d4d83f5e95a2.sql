-- Create atomic points update function to prevent race conditions
CREATE OR REPLACE FUNCTION public.add_user_points(
  _user_id UUID,
  _points INTEGER
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_total INTEGER;
BEGIN
  UPDATE users
  SET points = COALESCE(points, 0) + _points
  WHERE id = _user_id
  RETURNING points INTO new_total;
  
  RETURN new_total;
END;
$$;